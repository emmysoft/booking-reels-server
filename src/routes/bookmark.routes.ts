import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { addBookmark, getBookmarks } from '../controllers/bookmark.controller';


const router = express.Router();

//routers for bookmark
router.post("/", protect, addBookmark);
router.get("/", protect, getBookmarks);

export default router;