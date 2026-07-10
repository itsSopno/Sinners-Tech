import type { Request, Response } from "express";
import { NotificationModel } from "../Models/notification.model.js";

// @route GET /api/notification/get/:email
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }

        const notifications = await NotificationModel.find({ recipientId: email })
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @route PATCH /api/notification/read
export const markNotificationsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }

        await NotificationModel.updateMany(
            { recipientId: email, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "Notifications marked as read"
        });
    } catch (error: any) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
