import { Server, Socket } from "socket.io";
import { MessageModel } from "../Models/message.model.js";

// Map to store online users: userId -> socketId
const onlineUsers = new Map<string, string>();

export const initSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: (_origin, callback) => callback(null, true), // Enhanced flexibility for local dev
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling'] // Allow fallback for better stability
    });

    console.log("⚓ Socket.io Initialized");

    io.on("connection", (socket: Socket) => {
        console.log("⚡ User Connected:", socket.id);

        // 1. Join Personal Room
        socket.on("join-user", (userId: string) => {
            onlineUsers.set(userId, socket.id);
            socket.join(userId);
            console.log(`👤 User ${userId} joined their personal room`);
            
            // Broadcast online status if needed
            io.emit("user-online", userId);
        });

        // 2. Private Messaging
        socket.on("send-message", async (data: {
            senderId: string;
            receiverId: string;
            message: string;
            image?: string;
        }) => {
            const { senderId, receiverId, message, image } = data;

            try {
                // OPTIMIZATION: Optimistically build the message object and emit INSTANTLY.
                // This removes the 50-200ms database latency from real-time communication.
                const optimisticMessage = {
                    senderId,
                    receiverId,
                    message,
                    image: image || "",
                    createdAt: new Date(),
                    _id: Date.now().toString() // Temp ID until DB sync
                };

                // Emit to recipient immediately
                io.to(receiverId).emit("new-message", optimisticMessage);
                
                // Fire and forget background DB Save
                Promise.all([
                    MessageModel.create({
                        senderId,
                        receiverId,
                        message,
                        image: image || ""
                    }),
                    // Send background notification
                    import("../Models/notification.model.js").then(({ NotificationModel }) => {
                        return NotificationModel.create({
                            recipientId: receiverId,
                            senderId,
                            type: "MESSAGE",
                            content: message.substring(0, 40) + (message.length > 40 ? "..." : ""),
                            title: "New Message"
                        });
                    })
                ]).then(([savedMessage, savedNotification]) => {
                    // Emit real DB saved object back to sender for sync
                    socket.emit("message-sent", savedMessage);
                    // Also trigger notification ping on receiver
                    io.to(receiverId).emit("new-notification", savedNotification);
                }).catch(err => console.error("Background DB Sync Error:", err));

                console.log(`📩 Instant Message from ${senderId} to ${receiverId}`);

            } catch (error) {
                console.error("❌ Error sending socket message:", error);
                socket.emit("error", "Failed to send message");
            }
        });

        // 2b. Like Notification Event
        socket.on("send-notification", async (data: {
            recipientId: string;
            senderId: string;
            type: "LIKE" | "COMMENT";
            content: string;
            title: string;
        }) => {
            try {
                const { NotificationModel } = await import("../Models/notification.model.js");
                const savedNotification = await NotificationModel.create(data);
                io.to(data.recipientId).emit("new-notification", savedNotification);
            } catch (err) {
                console.error("Failed to send notification via socket:", err);
            }
        });

        // 3. Typing Indicator
        socket.on("typing", (data: { senderId: string, receiverId: string }) => {
            io.to(data.receiverId).emit("user-typing", data.senderId);
        });

        // 4. Disconnect
        socket.on("disconnect", () => {
            // Find and remove from onlineUsers
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("user-offline", userId);
                    console.log(`👋 User ${userId} Disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};
