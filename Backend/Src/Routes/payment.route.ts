import { Router } from "express";
import { getPaymentdataController, initiatePayment, paymentDeleteController, updatePaymentStatus, verifyPayment } from "../Controllers/payment.controller.js";

const paymentRouter: Router = Router();

paymentRouter.post("/initiate", initiatePayment);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/paymentData", getPaymentdataController)
paymentRouter.patch("/update/:id", updatePaymentStatus)
paymentRouter.delete("/delete/:id", paymentDeleteController)
export default paymentRouter;
