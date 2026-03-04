import axios from "axios";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const fetchBookById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const searchBooks = async (query: string) => {
    const response = await axios.get(`${BASE_URL}?q=${query}`);
    return response.data;
};