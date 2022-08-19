const nodemailer = require('nodemailer');
const config = require('./config.json');
require ('dotenv').config();
module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = process.env.EMAILFROM}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.USER,
            pass : process.env.PASS
        }
    })
    await transporter.sendMail({ from, to, subject, html });
}