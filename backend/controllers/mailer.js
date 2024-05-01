const nodemailer = require("nodemailer");
require("dotenv").config();


/** POST: http://localhost:4000/api/registerMail 
     {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
const registerMail = async (req, res) => {
    try {
        const { username, userEmail, text, subject } = req.body;

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: 'Abhikant Singh',
            to: userEmail,
            subject: subject,
            html: `<p>${text}</p>`,                             // HTML-formatted email body
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

module.exports = { registerMail };