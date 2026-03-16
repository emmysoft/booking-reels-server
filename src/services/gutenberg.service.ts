import axios from "axios";

const BASE_URL = "https://gutendex.com";

export const searchGutenbergBooks = async (query: string) => {
    const response = await axios.get(`${BASE_URL}/books`, {
        params: { search: query, languages: "en" },
    });
    return response.data.results; // array of books
};

export const getGutenbergBookById = async (id: number) => {
    const response = await axios.get(`${BASE_URL}/books/${id}`);
    return response.data;
};

export const getBooksByTopic = async (topic: string) => {
    const response = await axios.get(`${BASE_URL}/books`, {
        params: { topic, languages: "en" },
    });
    return response.data.results;
};

// Extract readable text URL from book formats
export const getReadableUrl = (formats: Record<string, string>): string | null => {
    return (
        formats["text/html"] ||
        formats["text/html; charset=utf-8"] ||
        formats["text/plain"] ||
        formats["text/plain; charset=utf-8"] ||
        null
    );
};