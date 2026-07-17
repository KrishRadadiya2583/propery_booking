 const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/apiResponse");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "wonderlust-dev-secret";

function signToken(user, expiresIn = "7d") {
    return jwt.sign(
        { id: String(user._id || user.id), email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

function apiAuth(required = true) {
    return (req, res, next) => {
        const header = req.headers.authorization || "";
        let user = null;

        if (header.startsWith("Bearer ")) {
            const payload = verifyToken(header.slice(7));
            if (payload) user = payload;
        }

        if (!user && req.session && req.session.user) {
            user = req.session.user;
        }

        if (!user && required) {
            return unauthorized(res);
        }

        req.user = user;
        next();
    };
}

module.exports = { apiAuth, signToken, verifyToken, JWT_SECRET };
