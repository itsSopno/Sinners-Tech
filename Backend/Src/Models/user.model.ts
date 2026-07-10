import mongoose, { Schema, Document, Model } from "mongoose"
export interface IUser extends Document {
    name: string;
    email: string;
    image: String;
    password: string;
    address: string;
    phoneNumber: Number;
    createdAt?: Date;
    updatedAt?: Date;
    googleId: string;


}
const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name is required"]

    },
    image: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]

    },
    password: {
        type: String,
        required: [true, "Password is required"]

    },
    address: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    googleId: {
        type: String,
        required: false
    }

}, {
    timestamps: true,
})

const userModel: Model<IUser> = mongoose.model<IUser>("user", userSchema)
export default userModel