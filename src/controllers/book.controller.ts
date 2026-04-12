import { Request, Response } from "express";
import Book from "../models/book.model";
import {
    searchGutenbergBooks,
    getGutenbergBookById,
    getBooksByTopic,
    getReadableUrl,
} from "../services/gutenberg.service";

// Helper to map Gutenberg data to our schema
const mapGutenbergBook = (item: any) => ({
    gutenbergId: item.id,
    title: item.title || "",
    authors: item.authors || [],
    description: item.summaries?.[0] || "",
    thumbnail: item.formats?.["image/jpeg"] || "",
    subjects: item.subjects || [],
    bookshelves: item.bookshelves || [],
    languages: item.languages || [],
    readableUrl: getReadableUrl(item.formats) || "",
    downloadCount: item.download_count || 0,
});

//get books
export const getBooksController = async (req: Request, res: Response) => {
    try {
        let books = await Book.find();

        // If DB is empty or sparse, seed it from Gutenberg
        if (books.length < 20) {
            const results = await searchGutenbergBooks(""); // fetches popular/default books
            const booksToInsert = results.map(mapGutenbergBook);

            await Book.insertMany(booksToInsert, { ordered: false }).catch(() => { });

            books = await Book.find();
        }

        res.json(books);
    } catch (error) {
        console.error("getBooksController error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Search books
export const searchBooksController = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query || (query as string).trim() === "") {
            return res.status(400).json({ error: "Query is required" });
        }

        // Check MongoDB cache first
        let books = await Book.find({
            title: { $regex: query, $options: "i" },
        }).limit(20);

        if (books.length === 0) {
            const results = await searchGutenbergBooks(query as string);

            const booksToInsert = results.map(mapGutenbergBook);

            books = await Book.insertMany(booksToInsert, {
                ordered: false,
            }).catch(() => []) as any;

            // If insertMany fails (duplicates), fetch from DB
            if (!books.length) {
                books = await Book.find({
                    title: { $regex: query, $options: "i" },
                }).limit(20);
            }
        }

        res.json(books);
    } catch (error) {
        console.error("searchBooksController error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get book by ID
export const getBookDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        let book = await Book.findById(id);

        if (!book) {
            // Try by gutenbergId
            book = await Book.findOne({ gutenbergId: Number(id) });
        }

        if (!book) {
            const gutenbergBook = await getGutenbergBookById(Number(id));
            book = new Book(mapGutenbergBook(gutenbergBook));
            await book.save();
        }

        res.json(book);
    } catch (error) {
        console.error("getBookDetails error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Read book content - proxy the text to avoid CORS issues on mobile
export const readBookController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id) || await Book.findOne({ gutenbergId: Number(id) });

        if (!book || !book.readableUrl) {
            return res.status(404).json({ error: "Book content not available" });
        }

        // Return the readable URL for the frontend to open
        res.json({
            title: book.title,
            readableUrl: book.readableUrl,
            gutenbergId: book.gutenbergId,
        });
    } catch (error) {
        console.error("readBookController error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get books by topic/category
export const getBooksByTopicController = async (req: Request, res: Response) => {
    try {
        const { topic } = req.params;

        let books = await Book.find({
            $or: [
                { subjects: { $regex: topic, $options: "i" } },
                { bookshelves: { $regex: topic, $options: "i" } },
            ],
        }).limit(20);

        if (books.length === 0) {
            const results = await getBooksByTopic(topic as string);
            const booksToInsert = results.map(mapGutenbergBook);
            books = await Book.insertMany(booksToInsert, { ordered: false }).catch(() => []) as any;

            if (!books.length) {
                books = await Book.find({
                    $or: [
                        { subjects: { $regex: topic, $options: "i" } },
                        { bookshelves: { $regex: topic, $options: "i" } },
                    ],
                }).limit(20);
            }
        }

        res.json(books);
    } catch (error) {
        console.error("getBooksByTopicController error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};