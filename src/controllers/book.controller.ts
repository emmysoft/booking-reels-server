import { Request, Response } from "express";
import Book from "../models/book.model";
import { fetchBookById, searchBooks } from "../services/googleBooks.service";

export const getBookDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        //check if cached
        let book = await Book.findOne({ googleBooksId: id });

        if (!book) {
            //fetch from google books api
            const googleBook = await fetchBookById(id as string);

            const volumeInfo = googleBook.volumeInfo;

            book = new Book({
                googleBooksId: id,
                title: volumeInfo.title,
                authors: volumeInfo.authors || [],
                description: volumeInfo.description || "",
                thumbnail: volumeInfo.imageLinks?.thumbnail || "",
                publishedDate: volumeInfo.publishedDate || "",
                categories: volumeInfo.categories || [],
                pageCount: volumeInfo.pageCount || 0,
            });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    };
};

export const searchBooksController = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query || (query as string).trim() === "") {
            return res.status(400).json({ error: "Query is required" });
        }

        let books = await Book.find({ title: { $regex: query, $options: "i" } });

        if (books.length === 0) {
            try {
                const googleData = await searchBooks(query as string);
                const items = googleData.items || [];
                const booksToInsert = items.map((item: any) => ({
                    googleBooksId: item.id,
                    title: item.volumeInfo.title || "",
                    authors: item.volumeInfo.authors || [],
                    description: item.volumeInfo.description || "",
                    thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
                    publishedDate: item.volumeInfo.publishedDate || "",
                    categories: item.volumeInfo.categories || [],
                    pageCount: item.volumeInfo.pageCount || 0,
                }));
                books = await Book.insertMany(booksToInsert, { ordered: false }) as any;
            } catch (googleError: any) {
                if (googleError?.response?.status === 429) {
                    return res.status(200).json([]); // 👈 return empty instead of crashing
                }
                throw googleError;
            }
        }

        res.json(books);
    } catch (error) {
        console.error("searchBooksController error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};