const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transport = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    } 
    const transporter = nodemailer.createTransport(transport)
 
    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

   await transporter.sendMail(message)
}




exports.sendLoginEmail = async (email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'Login OTP',
        text: `Your OTP for login is: ${otp}`
    };

    try {
        await transporter.sendMail(message);
        console.log('Login OTP email sent successfully to:', email);
        return otp; // Return the generated OTP for further use
    } catch (error) {
        console.error('Error sending login OTP email:', error);
        throw new Error('Error sending login OTP email');
    }
};

const sendOrderConfirmationEmail = (email, order) => {
    if (!email || typeof email !== 'string' || !email.trim()) {
        console.error('Error: Invalid or empty recipient email address provided.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'Order Confirmation',
        text: `Thank you for your order! Your order ID is ${order._id}.`
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error('Error sending order confirmation email:', error);
        } else {
            console.log('Order confirmation email sent:', info.response);
        }
    });
};

const sendOrderStatusUpdateEmail = (email, order) => {
    if (!email || typeof email !== 'string' || !email.trim()) {
        console.error('Error: Invalid or empty recipient email address provided.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'Order status',
        text: `Thank you for your order! Your order is ${order.orderStatus}.`
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error('Error sending order status update email:', error);
        } else {
            console.log('Order status update email sent:', info.response);
        }
    });
};




module.exports = {
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendEmail
   
};
