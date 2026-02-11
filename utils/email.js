const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendEmail(to, booking) {
    try{
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Confirmation",
    html: `
      <h2>Booking Confirmed</h2>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Listing:</strong> ${booking.listingtitle}</p>
      <p><strong>Check-in:</strong> ${booking.checkIn}</p>
      <p><strong>Check-out:</strong> ${booking.checkOut}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>

      <p><strong>Thank you for booking with us! 
      
      Dear Valued Customer,

Warm greetings from our team!

Thank you for choosing Wanderlust Properties. We’re delighted to have you with us and look forward to making your experience smooth, convenient, and enjoyable. Our platform is designed to help you manage your bookings quickly and easily, with all the tools you need in one place. </strong></p>
    

    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
    }
    catch(err){
        console.log(err);
    }
};
