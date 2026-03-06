import axios from "axios";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const fetchBookById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

// googleBooks.service.ts
export const searchBooks = async (query: string) => {
    const response = await axios.get(`${BASE_URL}`, {
        params: {
            q: query,
            maxResults: 10,
            key: process.env.GOOGLE_BOOKS_API_KEY, // 👈 add API key to avoid rate limits
        }
    });
    return response.data;
};