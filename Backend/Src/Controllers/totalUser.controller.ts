import type { Request, Response } from "express";
import UserDataModel from "../Models/userdata.model.js";

/**
 * @name CreateUserDataModel 
 * @desc create a new user data 
 * @route POST/api/
 * @acess Private
 */

export const CreateUserDataModel = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        if (userData.email) {
            const existingUser = await UserDataModel.findOne({ email: userData.email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists with this email"
                });
            }
        }
        const newUser = await UserDataModel.create(userData);
        return res.status(201).json({
            success: true,
            message: "Data saved successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error in CreateUserDataModel:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * @name getUserFullData
 * @desc get user data by email
 * @route GET /api/user/get/:email
 * @access Public (No auth middleware found in route)
 */

export const getUserFullData = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email parameter is missing" });
        }

        const user = await UserDataModel.findOne({ email: String(email) });

        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name editUserDataController
 * @desc user can edit their data by using their email
 * @route PUT/api/user/edit/:email
 * @access public
 */

export const updateUserData = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        const updatedUser = await UserDataModel.findOneAndUpdate(
            { email: String(email) },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name getEveryUserController
 * @desc by using this controller , admin get every user data
 * @route GET /api/user/get-every-user
 * @access Public
 */

// req এর পরিবর্তে _req ব্যবহার করুন
export const getAllUsersFullData = async (_req: Request, res: Response) => {
    try {
        const users = await UserDataModel.find({});

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};