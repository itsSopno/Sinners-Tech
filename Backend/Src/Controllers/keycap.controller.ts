import type { Request, Response } from "express";
import KeycapsModel from "../Models/keycaps.model.js";

/**
 * @name createKeycapsCollectionController
 * @desc add every key caps
 * @route POST /api/keycaps
 * @access private
 */

export const createKeycapsCollectionController = async (req: Request, res: Response) => {
    try {
        const products = Array.isArray(req.body) ? req.body : [req.body];

        const processedProducts = products.map(p => ({
            name: p.name,
            price: p.price ?? 199, // Default price if missing
            image: p.image,
            description: p.description ?? "High-end tech peripheral.",
            brand: p.brand ?? "Tech Gear",

        }));

        // Basic validation
        for (const p of processedProducts) {
            if (!p.name || !p.image || !p.description) {
                return res.status(400).json({ message: "Missing required fields (name, image, or description) in one or more items." })
            }
        }

        const keycaps = await KeycapsModel.insertMany(processedProducts);

        return res.status(201).json({
            message: "Successful",
            count: keycaps.length,
            keycaps
        })

    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
/**
 * @name getaLLKeyCapsCollection Controller
 * @desc get all key caps
 * @route get/api/getkeycaps
 */
export const getAllKeyCapsCollectionController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { brand, searchTerm } = req.query;
        let query: any = {};
        if (brand) query.brand = brand;
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }
        const keycaps = await KeycapsModel.find(query).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: keycaps.length,
            keycaps
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Error fetching keycaps", error: error.message })
    }
}
/**
 * @name getSingleKeycapController
 * @desc get single keycap
 * @route get/api/getkeycap/:id
 */
export const getSingleKeycapController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const keycap = await KeycapsModel.findById(req.params.id);
        if (!keycap) {
            return res.status(404).json({ message: "Keycap not found" })
        }
        return res.status(200).json({
            success: true,
            keycap
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Error fetching keycap", error: error.message })
    }
}
/**
 * @name updateKeycapController
 * @desc update keycap
 * @route put/api/updatekeycap/:id
 */
export const updateKeycapController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const keycap = await KeycapsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!keycap) {
            return res.status(404).json({ message: "Keycap not found" })
        }
        return res.status(200).json({
            success: true,
            keycap
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Error updating keycap", error: error.message })
    }
}
/**
 * @name deleteKeycapController
 * @desc delete keycap
 * @route delete/api/deletekeycap/:id
 */
export const deleteKeycapController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const keycap = await KeycapsModel.findByIdAndDelete(req.params.id);
        if (!keycap) {
            return res.status(404).json({ message: "Keycap not found" })
        }
        return res.status(200).json({
            success: true,
            message: "Keycap deleted successfully"
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Error deleting keycap", error: error.message })
    }
}
