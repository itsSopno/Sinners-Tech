import type { Request, Response } from "express";
import { TopProduct } from "../Models/Top.model.js";

/**
 * @name createTopProductController
 * @desc user create top product controller
 * @route POST/api/
 */
export const createTopProductController = async (req: Request, res: Response) => {
    try {
        const { name, price, image, category, description, brand, stock, tag } = req.body;
        const topProduct = new TopProduct({
            name,
            price,
            image,
            category,
            description,
            brand,
            stock,
            tag
        })
        await topProduct.save();
        return res.status(201).json({
            success: true,
            message: "Top product created successfully",
            topProduct
        })
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

/**
 * @name getAllTopProductController
 * @desc get all top product controller
 * @route GET/api/
 */
export const getAllTopProductController = async (_req: Request, res: Response) => {
    try {
        const topProducts = await TopProduct.find();
        return res.status(200).json({
            success: true,
            message: "Top products fetched successfully",
            topProducts
        })
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

/**
 * @name getSingleTopProductController
 * @desc get single top product controller
 * @route GET/api/
 */
export const getSingleTopProductController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const topProduct = await TopProduct.findById(id);
        return res.status(200).json({
            success: true,
            message: "Top product fetched successfully",
            topProduct
        })
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
