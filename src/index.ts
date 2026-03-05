import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDatabase();

    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown handling
    process.on("SIGINT", async () => {
        console.log("🛑 Shutting down server...");
        server.close(() => {
            process.exit(0);
        });
    });
};

startServer();