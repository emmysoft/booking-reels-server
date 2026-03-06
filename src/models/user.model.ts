import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
}, { timestamps: true });

// ✅ Exclude password from all responses
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);
export default User;