import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;