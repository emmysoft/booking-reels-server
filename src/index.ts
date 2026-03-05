import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";

// dotenv.config();
console.log("JWT Token:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();