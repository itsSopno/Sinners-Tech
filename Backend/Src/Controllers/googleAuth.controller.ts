import type { Request, Response } from "express"
import googleModel from "../Models/google.model.js"
import jwt from "jsonwebtoken"
import { type CustomRequest } from "../middleware/auth.middleware.js";
/**
 * @name GoogleRegesterController
 * @desc post google Regester data, It will work for both regester and login
 * 
 *@access Public
 */
export const GoogleAuthController = async (req: Request, res: Response) => {
    try {
        const { googleId, email, name, image } = req.body;

        if (!googleId || !email || !name || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }


        let user = await googleModel.findOne({ email });

        if (!user) {
            user = await googleModel.create({
                googleId,
                email,
                name,
                image
            });
        } else {
            user.image = image;
            user.name = name;
            await user.save();
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        return res.status(200).json({
            message: "Authentication Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * @name Get GoogleLoginData controller
 * @desc user can get here google login data 
 * @route GET api/Google
 * @access proivate
 * 
 */
export const getMe = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const userId = (req as any).userId;
        const user = await googleModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: (user as any).role || 'user'
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @name GoogleLogoutController
 * @des for logout system
 * @acces private
 * @route GET api/Google/Logout
 */
export const LogoutController = async (_req: Request, res: Response): Promise<Response | void> => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully! See you again, Lando fan! 🏎️"
        });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};

/**
 * @name optionalController
 * @desc user can update address and phone number
 * @route PUT/api/auth/optional
 * @access Private
 */
export const optionalController = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const { address, phoneNumber } = req.body;
        const user = await googleModel.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (address) user.address = address;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};