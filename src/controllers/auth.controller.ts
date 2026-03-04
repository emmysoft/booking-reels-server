import bcrypt from "bcryptjs";
import User from '../models/user.model';
import jwt from "jsonwebtoken";

//register controller
export const register = async ({ req, res }: any) => {
    //body of api
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.json(user);
};

//login controller
export const login = async ({req, res}: any) => { 
    const { email, password } = req.body;

    const user = await User.findOne({email});

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