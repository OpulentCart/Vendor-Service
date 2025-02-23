const nodemailer = require("nodemailer");

exports.sendEmail = async ({to, file}) => {
    if (!to) {
        console.error("Recipient email is missing!");
        return;
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Vendor Store Certificate',
        text: `Please find your Carbon Credit Certificate attached.  
                And Download it from the given url: ${file}`
    });
};