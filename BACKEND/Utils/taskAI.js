const axios = require("axios");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store your API key in .env file

const generateTasks = async (requirements) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant that helps manage wood furniture production tasks efficiently."
                    },
                    {
                        role: "user",
                        content: `Given the following furniture order details, generate a structured list of production tasks, estimated time per task, required skills, and detect if the deadline is feasible. If the deadline is not feasible, suggest a realistic completion time.  
                        
                        Order Details: ${JSON.stringify(requirements)}`
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        return JSON.parse(aiResponse); // Ensure AI responds with structured JSON
    } catch (error) {
        console.error("Error generating tasks with AI:", error.response?.data || error.message);
        return null;
    }
};

module.exports = { generateTasks };
