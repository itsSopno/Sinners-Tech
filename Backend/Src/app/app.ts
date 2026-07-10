import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import app from "../index.js"
import connectDB from '../Config/database.js';
import { initSocket } from '../Socket/socketManager.js';

// DNS সার্ভার সেটআপ
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ES Modules-এ __dirname সেটআপ করার নিয়ম
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env ফাইল কনফিগারেশন
dotenv.config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.PORT || 10001;

const server = createServer(app);
initSocket(server);

const startServer = async () => {
    try {
        // ডাটাবেস কানেকশন
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();