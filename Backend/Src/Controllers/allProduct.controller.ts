import type { Request, Response } from "express";
import productModel from "../Models/all.model.js";

/**
 * @name CreateAllProductController
 * @desc for all product
 * @access public
 */

export const CreateAllProductController = async (req: Request, res: Response) => {
    try {
        const products = Array.isArray(req.body) ? req.body : [req.body];

        const processedProducts = products.map(p => ({
            name: p.name,
            price: p.price ?? 199, // Default price if missing
            image: p.image,
            quantity: p.quantity ?? 100, // Default stock if missing
            category: p.category ?? "Keyboards",
            description: p.description ?? "High-end tech peripheral.",
        }));

        // Basic validation
        for (const p of processedProducts) {
            if (!p.name || !p.image || !p.description) {
                return res.status(400).json({ message: "Missing required fields (name, image, or description) in one or more items." })
            }
        }

        const keyboards = await productModel.insertMany(processedProducts);

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
 * @name getallProduct
 * @desc get all product from here 
 * @access public
 */

export const getAllProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { category, searchTerm } = req.query;
        let query: any = {};
        if (category) query.category = category;
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }
        const products = await productModel.find(query).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: products.length,
            product: products
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Error fetching products", error: error.message })
    }
}

/**
 * @name getSingleProductController
 * @desc for every single product
 * @access Public
 */
export const getSingleProductController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            product: product
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Invalid ID or Server Error", error: error.message });
    }
};

/**
 * @name changeProductController
 * @desc for changing any product
 * @route PUT/api/product/:id
 * @access private
 */

export const changeProductController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, image, quantity, category, description } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ massage: "Product not found" })
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.image = image || product.image;
        product.quantity = quantity || product.quantity;
        product.category = category || product.category;
        product.description = description || product.description;
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    }
    catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

