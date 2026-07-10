import { type Request, type Response } from "express";
import PaymentModel from "../Models/payment.model.js";

// @desc    Initiate a new payment
// @route   POST /api/payment/initiate
// @access  Private
export const initiatePayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userEmail, userImage, items, totalAmount, transactionId } = req.body;

        if (!userEmail || !items || !totalAmount || !transactionId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newPayment = await PaymentModel.create({
            userEmail,
            userImage,
            items,
            totalAmount,
            transactionId,
            paymentStatus: 'pending'
        });

        // Forward to the external processing server
        try {
            const externalRes = await fetch("https://t-mark-4.vercel.app/api/payment/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail,
                    userImage,
                    items,
                    totalAmount,
                    transactionId
                })
            });
            const externalData = await externalRes.json();
            console.log("External payment API response:", externalData);
        } catch (fetchErr) {
            console.error("Failed to forward payment to external server:", fetchErr);
            // Optionally decide if this should block the success response or proceed
        }

        return res.status(201).json({
            success: true,
            message: "Payment initiated successfully",
            data: newPayment
        });
    } catch (error) {
        console.error("Payment initiation error:", error);
        return res.status(500).json({ success: false, message: "Server error during payment initiation" });
    }
};

// @desc    Verify payment status
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { transactionId, status } = req.body;

        const payment = await PaymentModel.findOneAndUpdate(
            { transactionId },
            { paymentStatus: status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: payment
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Server error during payment verification" });
    }
};
/**
 * @name getPaymentdataController
 * @desc user can get every paymentdata
 * @route GET /api/payment/getPaymentdata
 * @access Private
 */
export const getPaymentdataController = async (_req: Request, res: Response): Promise<any> => {
    try {
        const payments = await PaymentModel.find();
        return res.status(200).json({
            success: true,
            message: "Payment data fetched successfully",
            data: payments
        });
    } catch (error) {
        console.error("Payment data fetch error:", error);
        return res.status(500).json({ success: false, message: "Server error during payment data fetch" });
    }
};

/**
 * @name AcceptPaymnet
 * @desc accept payment from user and deliver product
 * @route PUT/api/payment/accept/:id
 * @access Private
 */
export const updatePaymentStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params; // URL theke payment ID niben
        const { status } = req.body; // Body theke 'completed', 'rejected' etc niben

        // 1. Validation check
        const allowedStatuses = ['pending', 'completed', 'failed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use: pending, completed, or rejected."
            });
        }

        // 2. Database e status update kora
        const updatedPayment = await PaymentModel.findByIdAndUpdate(
            id,
            { paymentStatus: status },
            { new: true } // updated data-ti return korbe
        );

        if (!updatedPayment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        // 3. Response pathano
        return res.status(200).json({
            success: true,
            message: `Payment status updated to ${status}`,
            data: updatedPayment
        });

    } catch (error) {
        console.error("Admin Update Error:", error);
        return res.status(500).json({ success: false, message: "Server error during status update" });
    }
};

/**
 * @name paymentDeleteController
 * @desc for delteing or canceling payment and order
 * @route DELETE/api/payment/:id
 * @acess Private;
 */
export const paymentDeleteController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const payment = await PaymentModel.findByIdAndDelete(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment data not found"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Payment deleted successfully",
                data: payment
            })
        }
    } catch (error) {
        console.error("Payment delete error:", error);
        return res.status(500).json({ success: false, message: "Server error during payment deletion" });
    }
}
