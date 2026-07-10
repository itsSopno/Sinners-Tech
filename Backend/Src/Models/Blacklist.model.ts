import mongoose, { Schema, Document, Model } from "mongoose";
export interface IBlacklist extends Document {
    token: String,
    createdAt?: Date,
    updatedAt?: Date,

}
const blackListSchema: Schema<IBlacklist> = new Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in blacklist"]

    }
}, {
    timestamps: true
})
const tokenBlacklistModel: Model<IBlacklist> = mongoose.model<IBlacklist>("BLACKLIST", blackListSchema)
export default tokenBlacklistModel