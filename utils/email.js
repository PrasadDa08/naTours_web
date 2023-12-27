const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 25,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'prasad <prasad@techis.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send Email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
