import { Schema, model, Document } from "mongoose";

interface IPayment extends Document {
    userEmail: string;
    userImage: string;
    items: {
        name: string;
        image: string;
        price: number;
    }[];
    totalAmount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    transactionId: string;
}
const paymentModel = model<IPayment>("Payment", new Schema({
    userEmail: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        image: String,
        price: Number,
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true
    }

}))

const PaymentModel = paymentModel;
export default PaymentModel;