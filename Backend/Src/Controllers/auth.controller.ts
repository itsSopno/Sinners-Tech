import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../Models/user.model.js";
import googleModel from "../Models/google.model.js";
import tokenBlacklistModel from "../Models/Blacklist.model.js";
import jwt from "jsonwebtoken";
import { type CustomRequest } from "../middleware/auth.middleware.js";

/**
 * @name registerUserController
 * @desc register a new user
 * @route POST /api/v1/auth/register
 * @access public
 */
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide name , email , and password" })
        }
        const isUserExist = await userModel.findOne({
            $or: [{
                email: email
            }, { name: name }]
        })
        if (isUserExist) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            name,
            email,
            password: hash
        })
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET as string, { expiresIn: "1d" })
        res.cookie("token", token, {
            httpOnly: true,
        })
        return res.status(201).json({
            message: "User Registered Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

/***
 * @NAME loginuser Controll
 * @desc login a user
 * @access public 
 */
export const LoginUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "passowrd is not valid" })
        }
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        )
        res.cookie("token", token, {
            httpOnly: true,

        })
        return res.status(200).json({
            message: "User Logged In successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })

    }
}
/** 
 * @name logoutUserCotroller 
 * @desc logout a user
 * @access public 
*/
export const logoutUserController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const token = req.cookies.token;
        if (token) {
            await tokenBlacklistModel.create({ token });
            res.clearCookie("token");
            return res.status(200).json({ message: "User logged out successfully" })
        }

        return res.status(200).json({ message: " no token found" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
};
/***
 * @name getMe controller 
 * @desc get user profile 
 * @access private 
 */
export const getMeController = async (req: CustomRequest, res: Response): Promise<Response | void> => {
    try {
        // Try local user first
        let user: any = await userModel.findById(req.user?.id);

        // Fallback to Google user if not found
        if (!user) {
            user = await googleModel.findById(req.user?.id);
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User found",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address || null,
                phoneNumber: user.phoneNumber || null,
            }
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
/**
 * @name optionalController
 * @desc by this user can upload their address and PhoneNumber for optional details
 * @route PUT/api/auth/optional
 * @access Private
 */
export const optionalController = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const { address, phoneNumber } = req.body;
        let user: any = await userModel.findById(req.user?.id);
        if (!user) {
            user = await googleModel.findById(req.user?.id);
        }
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
