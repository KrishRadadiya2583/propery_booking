const Notification = require("../models/notification");
const realtime = require("./realtime");

async function push({ userEmail, type, title, message, link, icon }) {
    if (!userEmail || !title) return null;
    try {
        const notif = await Notification.create({
            userEmail: String(userEmail).toLowerCase(),
            type: type || "system",
            title,
            message: message || "",
            link: link || "",
            icon: icon || "bi-bell",
        });
        realtime.emitNotification(userEmail, notif);
        return notif;
    } catch (err) {
        console.error("[notify.push]", err.message);
        return null;
    }
}

module.exports = { push };
