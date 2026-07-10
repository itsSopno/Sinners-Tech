import { Schema, Document, model } from "mongoose";

export interface IKeycaps extends Document {
    name: String,
    image: String,
    description: String,
    price: Number,
    brand: String,
}
const keyCapsSchema = new Schema<IKeycaps>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    }
})

const KeycapsModel = model<IKeycaps>("keycaps", keyCapsSchema);
export default KeycapsModel