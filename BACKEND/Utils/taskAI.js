const genAI = require("@google/generative-ai");
const Emp = require("../Model/EmpModel"); // Import your EmpModel
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const generateTasks = async (requirements) => {
    try {
        const genAIInstance = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAIInstance.getGenerativeModel({ model: "gemini-pro" });

        // Fetch employee data
        const employees = await Emp.find();

        // Construct the prompt with JSON response format instructions
        let prompt = `You are an AI assistant that helps manage wood furniture production tasks efficiently.
        Given the following furniture order details and employee information, generate a structured list of production tasks, estimated time per task, and assign each task to an employee based on their skills and availability.
        If the deadline is not feasible, suggest a realistic completion time.

        Order Details: ${JSON.stringify(requirements)}

        Employee Information: ${JSON.stringify(employees)}

        **Respond with a JSON object in the following format:**

        \`\`\`json
        {
            "tasks": [
                {
                    "taskName": "Task Name",
                    "estimatedTime": "Estimated Time (in hours/days)",
                    "assignedTo": "Employee ID"
                },
                // ... more tasks
            ],
            "totalEstimatedTime": "Total Estimated Time",
            "riskLevel": "Risk Level (High, Medium, Low)",
            "suggestedNewDeadline": "Suggested New Deadline (ISO 8601 format)"
        }
        \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        let aiResponseJson;
        try {
            aiResponseJson = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            return null;
        }

        return aiResponseJson;
    } catch (error) {
        console.error("Error generating tasks with AI:", error.message);
        return null;
    }
};

module.exports = { generateTasks };