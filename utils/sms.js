const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const sendSMS = async (to, booking) => {
    try{
  await client.messages.create({
    body: `Booking confirmed for ${booking.listingtitle}. Thank you for choosing Wanderlust Properties. 
Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}. We hope you have a wonderful and comfortable stay. 
If you need any assistance, feel free to contact us anytime.

Safe travels and enjoy your stay! ✨ `,
    from: process.env.TWILIO_PHONE,
    to: to,
  });
}
catch(err){
    req.flash("error", "Something went wrong");
    console.log(err);

}
};

module.exports = sendSMS;
