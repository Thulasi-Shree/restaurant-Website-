const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shipping: {
        name: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postal_code: String,
            country: String
        },
       
    },
    items: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        itemQuantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    itemsPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveryInstruction: {
        type: String
    },
    orderInstruction: {
        type: String
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        }
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    pickup: {
        type: String,
        required: true,
        default: 'delivery'
    },
    pickupTime: {
        type: String
    },
    selectedTimeSlot:{
        type: String
    },
    availableTimeSlots: {
        type: String
    },
    orderDeliveryTime: {
        type: String
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Order Placed'
    },
    restaurantId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
