import Bookmark from '../models/bookmark.model';
export const addBookmark = async (req: any, res: any) => {
    const { bookId } = req.body;

    const bookmark = await Bookmark.create({ user: req.user._id, book: bookId });
    res.json(bookmark);
};

export const getBookmarks = async (req: any, res: any) => {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate("book");
    res.json(bookmarks);
}