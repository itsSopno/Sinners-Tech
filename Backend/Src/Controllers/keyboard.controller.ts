import type { Request, Response } from "express";
import keyboardModel from "../Models/keyboard.model.js";

/**
 * @name createKeyboardCollectionControler
 * @desc create keyboard collection
 * @access public
 */
export const createKeyboardCollectionControler = async (req: Request, res: Response) => {
    try {
        const products = Array.isArray(req.body) ? req.body : [req.body];

        const processedProducts = products.map(p => ({
            name: p.name,
            price: p.price ?? 199, // Default price if missing
            image: p.image,
            stock: p.stock ?? 100, // Default stock if missing
            category: p.category ?? "Keyboards",
            brand: p.brand ?? "Tech Gear",
            layout: p.layout ?? "75%",
            switchType: p.switchType ?? "Mechanical",
            description: p.description ?? "High-end tech peripheral.",
            isFeatured: p.isFeatured ?? false,
        }));

        // Basic validation
        for (const p of processedProducts) {
            if (!p.name || !p.image || !p.description) {
                return res.status(400).json({ message: "Missing required fields (name, image, or description) in one or more items." })
            }
        }

        const keyboards = await keyboardModel.insertMany(processedProducts);

        return res.status(201).json({
            message: "Successful",
            count: keyboards.length,
            keyboards
        })

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
/**
 * @name getallkeybaord
 * @desc get all keyboard collection 
 * @access public
 */
export const getAllKeyboards = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { category, brand, searchTerm } = req.query;
        let query: any = {};

        // ১. ক্যাটাগরি বা ব্র্যান্ড অনুযায়ী ফিল্টার
        if (category) query.category = category;
        if (brand) query.brand = brand;

        // ২. সার্চ সুবিধা (নাম বা ডেসক্রিপশনে খুঁজবে)
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const keyboards = await keyboardModel.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: keyboards.length,
            keyboards
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching keyboards", error: error.message });
    }
};

/**
 * @name getSingleKeyboard
 * @desc get a single keyboard
 * @access public
 */
export const getSingleKeyboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const keyboard = await keyboardModel.findById(id);

        if (!keyboard) {
            return res.status(404).json({ message: "Keyboard not found" });
        }

        return res.status(200).json({
            success: true,
            keyboard
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Invalid ID or Server Error", error: error.message });
    }
};
