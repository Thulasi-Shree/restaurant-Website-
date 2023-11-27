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
    const emailContent = `
    <p>Dear ${order.shipping.name},</p>
    <p>Thank you for your order! Your order ID is ${order._id}.</p>
    <p>Order Details:</p>
    <p>Name: ${order.shipping.name}</p>
    <p>Email: ${order.shipping.email}</p>
    <p>Phone: ${order.shipping.phone}</p>
    <p>Address: ${order.shipping.address.line1}, ${order.shipping.address.line1}, ${order.shipping.address.city}- ${order.shipping.address.postal_code || 99765}, ${order.shipping.address.state}, ${order.shipping.address.country}</p>
    <p>
        ${order.items.map(item => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}
    </p>
    <p>Tax Price: $${order.taxPrice}</p>
    <p>Shipping Price: $${order.shippingPrice}</p>
    <p>Total Price: $${order.totalPrice}</p>
    <p>Payment: Paid </p>
    <p>Order Status: ${order.orderStatus}</p>
    <p>Order Placed at: ${order.createdAt}</p>
    <p>Order status changed at: ${Date.now()}</p>
    <p>Thank you for ordering with us!</p>
`;
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
        // text: `Thank you for your order! Your order ID is ${order._id}.`
        html: emailContent
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
    const emailContent = `
        <p>Dear ${order.shipping.name},</p>
        <p>Thank you for your order! Your order with order ID ${order._id} has been updated to ${order.orderStatus}.</p>
        <p>Order Details:</p>
        <p>Name: ${order.shipping.name}</p>
        <p>Email: ${order.shipping.email}</p>
        <p>Phone: ${order.shipping.phone || '-'}</p>
        <p>Address: ${order.shipping.address.line1}, ${order.shipping.address.line1}, ${order.shipping.address.city}, ${order.shipping.address.postal_code || ''}, ${order.shipping.address.state}, ${order.shipping.address.country}</p>
        <p>
            ${order.items.map(item => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}
        </p>
        <p>Tax Price: $${order.taxPrice}</p>
        <p>Shipping Price: $${order.shippingPrice}</p>
        <p>Total Price: $${order.totalPrice}</p>
        <p>Payment: Paid </p>
        <p>Order Status: ${order.orderStatus}</p>
        <p>Order Placed at: ${order.createdAt}</p>
        <p>Thank you for ordering with us!</p>
    `;

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
        html: emailContent
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
