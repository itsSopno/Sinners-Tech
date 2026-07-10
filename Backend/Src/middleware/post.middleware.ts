import type { Response, NextFunction } from "express";

import userModel from "../Models/user.model.js";
import { type CustomRequest } from "../middleware/auth.middleware.js"

/**
 * @name isAdmin middleware
 * @description this middleware is used to check if the user is admin or not
 * @acess private
 */
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const allowedEmails = ["admin@user", "nabiltalukderbd@gmail.com"];
        const users = await userModel.findById(req.user?.id)
        if (!users || !allowedEmails.includes(users.email)) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        return next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}