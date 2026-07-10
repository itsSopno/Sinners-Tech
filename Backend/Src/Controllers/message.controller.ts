import type { Request, Response } from "express";
import { MessageModel } from "../Models/message.model.js";
import UserDataModel from "../Models/userdata.model.js";

/**
 * @name getConversation
 * @desc Get message history between two users
 * @route GET /api/messages/history/:userId1/:userId2
 */
export const getConversation = async (req: Request, res: Response) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await MessageModel.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error in getConversation:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name getRecentChats
 * @desc Get list of people the user has chatted with
 * @route GET /api/messages/recent/:userId
 */
export const getRecentChats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Group by conversation and get the last message
        const recentMessages = await MessageModel.aggregate([
            {
                $match: {
                    $or: [{ senderId: userId }, { receiverId: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", userId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$message" },
                    lastImage: { $first: "$image" },
                    timestamp: { $first: "$createdAt" },
                    isRead: { $first: "$isRead" }
                }
            },
            {
                $sort: { timestamp: -1 }
            }
        ]);

        // Enrich with user data using email lookup
        const enrichedChats = await Promise.all(recentMessages.map(async (chat) => {
            const userData = await UserDataModel.findOne({ email: chat._id });
            return {
                ...chat,
                user: userData ? {
                    name: userData.name + " " + userData.lastName,
                    image: userData.image,
                    email: userData.email
                } : {
                    name: "Unknown User",
                    image: null,
                    email: chat._id
                }
            };
        }));

        return res.status(200).json({
            success: true,
            chats: enrichedChats
        });
    } catch (error) {
        console.error("Error in getRecentChats:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name sendMessageREST
 * @desc Fallback REST endpoint for sending messages (non-socket)
 */
export const sendMessageREST = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, message, image } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            message,
            image: image || ""
        });

        return res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error("Error in sendMessageREST:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
