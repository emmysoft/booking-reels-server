import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

//error handling middleware
app.use(errorHandler);

app.get("/health", (req, res) => res.json({ status: "ok" }));

export default app;