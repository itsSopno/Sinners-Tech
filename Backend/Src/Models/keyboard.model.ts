import { Schema, model, Document } from "mongoose";

interface IKeyBoard extends Document {
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    brand: string;
    switchType: string;
    layout: string;
    description: string;
    isFeatured: boolean;

}

const keyboardSchema = new Schema<IKeyBoard>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 199
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 100
    },
    category: {
        type: String,
        required: true,
        default: "Keyboards"
    },
    brand: {
        type: String,
        required: true,
        default: "Tech Gear"
    },
    layout: {
        type: String,
        default: "75%"
    },
    switchType: {
        type: String,
        default: "Mechanical"
    },
    description: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
})

const keyboardModel = model<IKeyBoard>("keyboard", keyboardSchema);
export default keyboardModel;