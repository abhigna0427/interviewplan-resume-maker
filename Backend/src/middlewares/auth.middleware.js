const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Check if token is blacklisted
        const isBlacklisted = await BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized (Token is blacklisted)"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = { id: decoded.id };
        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = {
    authUser: isAuthenticated,
    isAuthenticated
};