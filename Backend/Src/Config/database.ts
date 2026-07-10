import mongoose from "mongoose";

async function connectDB(): Promise<void> {
    try {
        const mongoUri = process.env.MONGO_URI as string;

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        // mongoose.connect() রিটার্ন করে একটি connection অবজেক্ট
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

        // ডাটাবেস এর নাম এবং কালেকশন চেক করার সঠিক উপায়
        const db = conn.connection.db;
        const dbName = conn.connection.name; // ডাটাবেসের নাম দেখাবে

        if (db) {
            const collectionName = "products";
            const collections = await db.listCollections({ name: collectionName }).toArray();

            if (collections.length === 0) {
                await db.createCollection(collectionName);
                console.log(`🚀 Collection '${collectionName}' created in ${dbName}!`);
            } else {
                console.log(`ℹ️ Collection '${collectionName}' already exists in ${dbName}`);
            }
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB Connection Error:", error.message);
        }
        process.exit(1);
    }
}

export default connectDB;