import mongoose from "mongoose";

//schema for user model
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
}, { timestamps: true });

//creating user model
const User = mongoose.model("User", userSchema);
export default User;