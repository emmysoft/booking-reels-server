import { Request, Response } from "express";
import Book from "../models/book.model";
import { fetchBookById } from "../services/googleBooks.service";

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

export const searchBooks = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const books = await Book.find({ title: { $regex: query, $options: "i" } });
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    };
};