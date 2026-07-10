import { Document, Schema, Model, model } from "mongoose";

export interface ITopProduct extends Document {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    brand: string;
    stock: number;
    tag?: string;
}

const TopProductSchema: Schema<ITopProduct> = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    tag: { type: String, required: false },
});

export const TopProduct: Model<ITopProduct> = model<ITopProduct>("TopProduct", TopProductSchema);