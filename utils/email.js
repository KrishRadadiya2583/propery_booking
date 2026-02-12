const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendEmail(to, booking) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Booking Confirmation",
      html: `
      <!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">


      <!-- Header -->
      <tr>
        <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
          <h1 style="margin:0;">Booking Confirmed</h1>
          <p style="margin:5px 0 0;">Wanderlust Properties</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:25px;">
          <p style="font-size:16px; margin-bottom:20px;">
            Dear <strong>${booking.name}</strong>,
          </p>

          <p style="font-size:15px; color:#555;">
            Thank you for choosing <strong>Wanderlust Properties</strong>. 
            Your booking has been successfully confirmed. Here are your details:
          </p>

          <!-- Booking Details -->
          <table width="100%" cellpadding="10" cellspacing="0" style="margin-top:20px; border-collapse:collapse;">
            <tr style="background:#f9fafb;">
              <td><strong>Listing</strong></td>
              <td>${booking.listingtitle}</td>
            </tr>
            <tr>
              <td><strong>Check-in</strong></td>
              <td>${booking.checkIn}</td>
            </tr>
            <tr style="background:#f9fafb;">
              <td><strong>Check-out</strong></td>
              <td>${booking.checkOut}</td>
            </tr>
            <tr>
              <td><strong>Guests</strong></td>
              <td>${booking.guests}</td>
            </tr>
            <tr style="background:#f9fafb;">
              <td><strong>Total Price</strong></td>
              <td style="color:#16a34a; font-weight:bold;">₹${booking.totalPrice}</td>
            </tr>
          </table>

          <!-- Message -->
          <p style="font-size:15px; color:#555; margin-top:25px;">
            We’re excited to host you and ensure a smooth, comfortable, and enjoyable stay.
            If you have any questions, feel free to contact our support team anytime.
          </p>

          <p style="font-size:15px; margin-top:20px;">
            Warm regards,<br>
            <strong>Wanderlust Properties Team</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#888;">
          © ${new Date().getFullYear()} Wanderlust Properties. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>

    `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  }
  catch (err) {
    console.log(err);
  }
};
