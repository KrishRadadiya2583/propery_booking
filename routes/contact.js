const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("contact");
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Save to DB or send email here
    console.log('Contact form submission:', { name, email, message });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});


module.exports = router;

