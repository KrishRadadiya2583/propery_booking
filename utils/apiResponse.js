function ok(res, data, meta) {
    return res.status(200).json({ success: true, data, ...(meta ? { meta } : {}) });
}

function created(res, data) {
    return res.status(201).json({ success: true, data });
}

function badRequest(res, message, details) {
    return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message, details } });
}

function unauthorized(res, message = "Authentication required") {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message } });
}

function forbidden(res, message = "You are not allowed to perform this action") {
    return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message } });
}

function notFound(res, message = "Resource not found") {
    return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message } });
}

function serverError(res, message = "Something went wrong", details) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message, details } });
}

function paginate(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 12));
    return { page, limit, skip: (page - 1) * limit };
}

function asyncHandler(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound, serverError, paginate, asyncHandler };
