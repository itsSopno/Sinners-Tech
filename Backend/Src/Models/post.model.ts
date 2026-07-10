import mongoose, { Schema, model, type Document } from "mongoose";
const CommentSchema = new Schema(
    {
        userID: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        image: { type: String },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

export interface IPost extends Document {
    author: {
        userID: string;
        email: string;
        username: string;
        userImage: string;
    };
    userEmail: string;
    content: string;
    images: string[];
    comments: {
        userID: string;
        email: string;
        username: string;
        image?: string;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        author: {
            userID: { type: String, required: true },
            email: { type: String, required: true },
            username: { type: String, required: true },
            userImage: { type: String, required: true },
        },
        userEmail: {
            type: String,
            required: true,
            index: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        comments: [CommentSchema],
        likes: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const PostModel = mongoose.models.Post || model<IPost>("Post", PostSchema);
export default PostModel;
