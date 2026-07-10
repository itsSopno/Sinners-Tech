import mongoose, { model, Schema, type Document } from "mongoose";

export interface IMessage extends Document {
    senderId: string;
    receiverId: string;
    message: string;
    image: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        senderId: {
            type: String,
            required: true,
            index: true
        },
        receiverId: {
            type: String,
            required: true,
            index: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            default: "",
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

export const MessageModel = mongoose.models.Message || model<IMessage>("Message", MessageSchema);
