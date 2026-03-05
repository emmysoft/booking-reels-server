import express from 'express';
import { getBookDetails, searchBooksController } from "../controllers/book.controller";

const router = express.Router();

router.get("/search", searchBooksController);
router.get("/:id", getBookDetails);

export default router;