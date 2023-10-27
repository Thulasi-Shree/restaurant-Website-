const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transport = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    } 
    const transpoter = nodemailer.createTransport(transport)
 
    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM__EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

   await transpoter.sendMail(message)
}

module.exports = sendEmail

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendLoginEmail = async options => {
    const otp = generateOTP(); 
    const transport = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };
    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: `Your OTP for verification is: ${otp}\n\n${options.message}`
    };

    try {
        await transporter.sendMail(message);
        console.log('Email sent successfully with OTP:', otp);
        return otp; // Return the generated OTP for further use
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

module.exports = sendLoginEmail;