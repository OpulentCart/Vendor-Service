const nodemailer = require("nodemailer");

exports.sendEmail = async ({to, attachments}) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Vendor Store Certificate',
        text: 'Please find your Carbon Credit Certificate attached.',
        attachments:[
            {
                filename: 'certificate.pdf'
            }
        ]
    });
};