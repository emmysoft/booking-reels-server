import express from 'express';
import {
    getBookDetails,
    searchBooksController,
    readBookController,
    getBooksByTopicController,
    getBooksController,
} from "../controllers/book.controller";

const router = express.Router();

router.get("/books", getBooksController);
router.get("/search", searchBooksController);
router.get("/topic/:topic", getBooksByTopicController);
router.get("/:id/read", readBookController);
router.get("/:id", getBookDetails);

export default router;