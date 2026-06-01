const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklist.model");

const registerUserController = async (req, res) => {
    try {
        console.log("registerUserController req.body:", req.body);
        const { username, email, password } = req.body;
        
        // Handle name coming from frontend register form
        const finalUsername = username || req.body.name;

        if (!finalUsername || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Account already exists with this email address"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username: finalUsername,
            email,
            password: hashedPassword
        });

        // Hide password
        user.password = undefined;

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const loginUserController = async (req, res) => {
    try {
        console.log("loginUserController req.body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Hide password
        user.password = undefined;

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            // Save token to blacklist database
            await BlacklistToken.create({ token });
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getMeController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({
                success: true,
                user: null
            });
        }

        const isBlacklisted = await BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(200).json({
                success: true,
                user: null
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(200).json({
                success: true,
                user: null
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(200).json({
            success: true,
            user: null
        });
    }
};

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};
