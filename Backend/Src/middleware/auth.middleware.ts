import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../Models/Blacklist.model.js";
import type { Request, Response, NextFunction } from "express";

/**
 * Custom request interface to include user object
 */
export interface CustomRequest extends Request {
    user?: any;
}

/**
 * Middleware to authenticate user via JWT token
 */
export const authUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Support token from cookies or authorization header
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Check if token is blacklisted (logged out)
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};
