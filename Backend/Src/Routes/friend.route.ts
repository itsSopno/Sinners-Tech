import { Router } from "express";
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    unfriend 
} from "../Controllers/friend.controller.js";

const friendRouter: Router = Router();

friendRouter.post("/request/send", sendFriendRequest);
friendRouter.post("/request/accept", acceptFriendRequest);
friendRouter.post("/request/reject", rejectFriendRequest);
friendRouter.delete("/unfriend", unfriend);

export default friendRouter;
