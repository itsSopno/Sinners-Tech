import { model, Schema, type Document } from "mongoose";

export interface IFriendRequest {
    from: string;
    userName:string,
    userImage:string,
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
}

export interface IUserData extends Document {
    userId: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    address: string;
    image: string;
    Bio: string;
    googleId?: string;
    coverImage?: string;
    isVerified: boolean;
    settings: {
        theme: string;
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        privacy: {
            profileVisibility: string;
            messageRequests: boolean;
        };
    };
    friends: string[]; // Array of emails
    friendRequests: IFriendRequest[];
    createdAt: Date;
    updatedAt: Date;
}

const UserDataSchema = new Schema<IUserData>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        Bio: {
            type: String,
            required: true
        },
        googleId: {
            type: String,
            required: false
        },
        coverImage: {
            type: String,
            required: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        settings: {
            theme: { type: String, enum: ["dark", "light"], default: "dark" },
            notifications: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true },
                sms: { type: Boolean, default: true }
            },
            privacy: {
                profileVisibility: { type: String, enum: ["public", "private"], default: "public" },
                messageRequests: { type: String, enum: ["public", "private"], default: "public" }
            }
        },
        friends: {
            type: [String],
            default: []
        },
        friendRequests: [
            {
                from: { type: String, required: true },
                userName: { type: String, required: true },
                userImage: { type: String, required: true },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending"
                },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

const UserDataModel = model<IUserData>("userdata", UserDataSchema);
export default UserDataModel;