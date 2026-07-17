const Notification = require("../../models/notification");
const { ok, asyncHandler } = require("../../utils/apiResponse");

exports.list = asyncHandler(async (req, res) => {
    const email = req.user.email.toLowerCase();
    const items = await Notification.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    const unread = await Notification.countDocuments({ userEmail: email, read: false });
    return ok(res, { items, unread });
});

exports.markAllRead = asyncHandler(async (req, res) => {
    const email = req.user.email.toLowerCase();
    await Notification.updateMany({ userEmail: email, read: false }, { $set: { read: true } });
    return ok(res, { ok: true });
});

exports.markRead = asyncHandler(async (req, res) => {
    const email = req.user.email.toLowerCase();
    await Notification.updateOne({ _id: req.params.id, userEmail: email }, { $set: { read: true } });
    return ok(res, { ok: true });
});
