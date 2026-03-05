import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit process if DB fails
    }
};

// 🔥 Graceful shutdown (important for production)
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log("🔌 MongoDB Disconnected");
    } catch (error) {
        console.error("Error disconnecting database:", error);
    }
};