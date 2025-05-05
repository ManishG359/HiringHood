const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   // your Gmail email
        pass: process.env.EMAIL_PASS    // Gmail App Password
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log('✅ Email sent successfully');
  } catch (err) {
    console.error('❌ Email send failed:', err);
  }
};

module.exports = sendEmail;
