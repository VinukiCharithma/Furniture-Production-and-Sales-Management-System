const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateTasks({ requirements, deadline }) {
    try {
        console.log("Generating tasks with requirements:", requirements);

        const prompt = `
        You are a woodworking production manager. Create a detailed task breakdown for this order with the following specifications:

        Order Details:
        ${requirements}

        Required Output Format:
        - Generate between 3-10 tasks depending on order complexity
        - Each task must include:
          * taskName (specific woodworking action)
          * description (detailed steps)
          * estimatedTime (in hours, minimum 0.5)
          * dueDate (ISO 8601 format)
          * materialsRequired (array of objects with name and quantity)
          * dependencies (array of task names this depends on)
        
        Additional Requirements:
        - Tasks should be logically ordered
        - Include setup and finishing tasks
        - Account for drying/curing time where needed
        - Prioritize safety-related tasks
        
        Output must be valid JSON in this exact format:
        {
            "tasks": [
                {
                    "taskName": "string",
                    "description": "string",
                    "estimatedTime": number,
                    "dueDate": "ISOString",
                    "materialsRequired": [
                        {"name": "string", "quantity": number}
                    ],
                    "dependencies": ["taskName"]
                }
            ],
            "riskAssessment": "string"
        }`;

        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
        });
        const response = await result.response;

        if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error("No valid AI response received");
            return null;
        }

        let aiResponseText = response.candidates[0].content.parts[0].text;
        console.log("Raw AI Response:", aiResponseText);

        // Clean the response
        aiResponseText = aiResponseText.replace(/```json|```/g, '').trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponseText);
            if (!Array.isArray(parsedResponse.tasks)) {
                throw new Error("Tasks array not found in response");
            }
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return null;
        }

        // Process tasks
        const processedTasks = parsedResponse.tasks.map(task => ({
            taskName: task.taskName || "Unnamed Task",
            description: task.description || "No description provided",
            estimatedTime: Math.max(0.5, Number(task.estimatedTime) || 1),
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(deadline),
            materialsRequired: task.materialsRequired || [],
            dependencies: task.dependencies || [],
            status: "Pending"
        }));

        // Calculate total time
        const totalEstimatedTime = processedTasks.reduce(
            (sum, task) => sum + task.estimatedTime, 0
        );

        // Determine risk level
        const riskLevel = parsedResponse.riskAssessment === "High" ? "High" :
                         totalEstimatedTime > 40 ? "Medium" : "Low";

        return {
            tasks: { tasks: processedTasks },
            totalEstimatedTime,
            riskLevel,
            suggestedNewDeadline: null,
            productionStartDate: new Date(),
            productionEndDate: new Date(new Date().getTime() + totalEstimatedTime * 60 * 60 * 1000)
        };

    } catch (error) {
        console.error("Error in generateTasks:", error);
        return null;
    }
}

module.exports = { generateTasks };