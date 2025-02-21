const nodemailer = require("nodemailer");

exports.sendEmail = async ({to, subject, text, attachments}) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: 
            pass:
        }
    })
};