const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { signToken } = require("../../middlewares/apiAuth");
const { ok, created, badRequest, unauthorized, asyncHandler } = require("../../utils/apiResponse");

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return badRequest(res, "name, email, password required");

    const existing = await User.findOne({ email });
    if (existing) return badRequest(res, "User with this email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = signToken(payload);
    if (req.session) req.session.user = payload;
    return created(res, { user: payload, token });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return badRequest(res, "email, password required");

    const user = await User.findOne({ email });
    if (!user) return unauthorized(res, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return unauthorized(res, "Invalid credentials");

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = signToken(payload);
    if (req.session) req.session.user = payload;
    return ok(res, { user: payload, token });
});

exports.me = asyncHandler(async (req, res) => {
    if (!req.user) return unauthorized(res);
    return ok(res, {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
});

exports.logout = asyncHandler(async (req, res) => {
    if (req.session) {
        req.session.destroy(() => {});
    }
    return ok(res, { loggedOut: true });
});
