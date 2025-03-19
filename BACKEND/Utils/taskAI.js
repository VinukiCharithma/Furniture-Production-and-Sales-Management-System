const genAI = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Get Gemini API Key from .env

const generateTasks = async (requirements) => {
    try {
        const genAIInstance = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAIInstance.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are an AI assistant that helps manage wood furniture production tasks efficiently.
        Given the following furniture order details, generate a structured list of production tasks, estimated time per task, required skills, and detect if the deadline is feasible.
        If the deadline is not feasible, suggest a realistic completion time.

        Order Details: ${JSON.stringify(requirements)}`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text(); // Get AI response as text

        return JSON.parse(aiResponse); // Ensure AI responds with structured JSON
    } catch (error) {
        console.error("Error generating tasks with AI:", error.message);
        return null;
    }
};


module.exports = { generateTasks };
