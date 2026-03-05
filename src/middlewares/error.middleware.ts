import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    code?: number;
    keyValue?: Record<string, any>;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = { ...err };
    error.message = err.message;

    // Default values
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    // 🔹 Mongoose CastError (Invalid ObjectId)
    if (err instanceof MongooseError.CastError) {
        error.statusCode = 400;
        error.message = `Invalid ${err.path}: ${err.value}`;
    }

    // 🔹 Mongoose Validation Error
    if (err instanceof MongooseError.ValidationError) {
        error.statusCode = 400;
        error.message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    // 🔹 Duplicate Key Error (MongoDB)
    if (err.code === 11000 && err.keyValue) {
        error.statusCode = 400;
        error.message = `Duplicate field value: ${Object.keys(
            err.keyValue
        ).join(", ")}`;
    }

    // 🔹 JWT Invalid
    if (err instanceof JsonWebTokenError) {
        error.statusCode = 401;
        error.message = "Invalid token. Please log in again.";
    }

    // 🔹 JWT Expired
    if (err instanceof TokenExpiredError) {
        error.statusCode = 401;
        error.message = "Token expired. Please log in again.";
    }

    // 🧠 Development vs Production Response
    if (process.env.NODE_ENV === "development") {
        return res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
            stack: err.stack,
        });
    }

    // Production (no stack trace leak)
    return res.status(error.statusCode).json({
        success: false,
        message: error.message || "Something went wrong",
    });
};