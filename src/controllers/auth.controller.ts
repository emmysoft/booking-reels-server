import bcrypt from "bcryptjs";
import User from '../models/user.model';
import jwt from "jsonwebtoken";

//register controller
export const register = async (req: any, res: any) => {
    //body of api
    const { name, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        return res.status(400).json({ error: "Email or username already taken" });
    };

    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    res.json(user);
};

//login controller
export const login = async (req: any, res: any) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !user.password) {
        return res.status(400).json({ error: "Invalid credentials" });
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
    };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.json({ token, user });
};

//logout controller
export const logout = async (req: any, res: any) => {
    res.json({ message: "Logged out successfully" });
};