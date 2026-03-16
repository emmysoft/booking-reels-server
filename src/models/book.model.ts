import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    gutenbergId: { type: Number, unique: true, sparse: true },
    title: String,
    authors: [{ name: String, birth_year: Number, death_year: Number }],
    description: String,
    thumbnail: String,
    subjects: [String],
    bookshelves: [String],
    languages: [String],
    readableUrl: String, // 👈 URL to read the book
    downloadCount: Number,
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;