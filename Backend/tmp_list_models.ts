import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API as string,
    apiVersion: 'v1beta'
});

async function listModels() {
    try {
        console.log("Listing available models...");
        const response = await ai.models.list();
        for await (const model of response) {
            console.log(`- ${model.name} (${model.displayName})`);
        }
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
