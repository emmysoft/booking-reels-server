import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    googleBookId: { type: String, unique: true },
    title: String,
    authors: [String],
    description: String,
    thumbnail: String,
    categories: [String],
    publishedDate: String,
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;