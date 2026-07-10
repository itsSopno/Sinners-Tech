import type { Request, Response } from "express";
import { getGenAI } from "../Gemini Ai/gemini.js";
import AllProduct from '../Models/all.model.js';

/**
 * @name geminiTestController
 * @description This controller is used to provide AI-powered product recommendations
 * @route POST /api/gemini-test
 * @access private
 */
export const geminiTestController = async (req: Request, res: Response) => {
    try {
        const { userPrompt } = req.body;
        const products = await AllProduct.find();
        const productList = JSON.stringify(products.map((p: any) => ({
            name: p.name,
            price: p.price,
            description: p.description,
            quantity: p.quantity,

        })))
        const prompt = `System: You are an E-commerce assistant.
Products: ${productList}

User: ${userPrompt}

Rules:
1. If the user says 'hi' or greets, reply warmly and ask how you can help.
2. If the user asks for a product, only suggest from the 'Products' list above.
3. If asked for a product not in the list, politely apologize and say it's unavailable.
4. Keep the output very concise.`;

        const response = await getGenAI().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return res.status(200).json({
            success: true,
            aiResponse: response.text
        });
    }
    catch (error: any) {
        console.error("Gemini API Error:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "AI ERROR: " + (error.message || "Failed to generate response")
        });
    }
}