import { Document, model, Schema } from "mongoose";

interface IProduct extends Document {
    name: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    quantity: Number,
}
const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
})

const productModel = model<IProduct>("product", ProductSchema);
export default productModel;    