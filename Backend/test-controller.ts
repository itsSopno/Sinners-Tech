import dotenv from 'dotenv';
dotenv.config();
import { getGenAI } from './Src/Gemini Ai/gemini.js';

const runTest = async () => {
    try {
        const productList = JSON.stringify([
            { name: "Laptop X", price: 1000, description: "Fast laptop", quantity: 5 },
            { name: "Mouse Y", price: 50, description: "Wireless mouse", quantity: 10 }
        ]);
        const userPrompts = ["Hi", "Hello there!", "Do you have any phones?", "tell me about laptop x"];

        for (const userPrompt of userPrompts) {
            console.log(`\nTesting user prompt: "${userPrompt}"`);
            const prompt = `You are a helpful E-Commerce assistant. 
Our available products: ${productList}

User Input: "${userPrompt}"

Reply naturally. If it's a greeting, greet back. If they ask about products, recommend from the available list. If asked about something we don't have, politely inform them it's unavailable. Keep it concise.`;

            const response = await getGenAI().models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            console.log("aiResponse:", response.text);
        }
    } catch (e: any) {
        console.error("Error:", e.message || e);
    }
}
runTest();
