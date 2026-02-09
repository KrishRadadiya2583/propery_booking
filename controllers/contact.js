module.exports.index = (req, res) => {
    res.render("contact");
};

module.exports.create =  async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if(!name || !email || !message){
      return res.status(400).json({ error: 'All fields are required' });
    }
    if(email !== req.session.user.email){
      return res.status(400).json({ error: 'You are not authorized to send message' });
    }

    console.log('Contact form submission:', { name, email, message });
    req.flash("success", "Message sent successfully");
    res.redirect("/contact");
  } catch (err) {
    req.flash("error", "Failed to send message");
    res.redirect("/contact");
  }
}