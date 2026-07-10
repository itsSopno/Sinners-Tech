import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const token = req.cookies.Token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};