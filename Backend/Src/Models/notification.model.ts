import mongoose, { model, Schema, type Document } from "mongoose";

export interface INotification extends Document {
    recipientId: string;
    senderId: string;
    type: "MESSAGE" | "LIKE" | "COMMENT";
    title?: string;
    content: string;
    isRead: boolean;
    relatedEntityId?: string; // e.g. Post ID or Message ID
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipientId: {
            type: String,
            required: true,
            index: true
        },
        senderId: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["MESSAGE", "LIKE", "COMMENT"],
            required: true
        },
        title: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        relatedEntityId: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export const NotificationModel = mongoose.models.Notification || model<INotification>("Notification", NotificationSchema);
