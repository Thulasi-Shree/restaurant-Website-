const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shippingInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: 'Product'
        }

    }],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
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
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    pickup: {
        type: Boolean,
        required: true,
        default: false
    },
    pickupTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
      },
    availableTimeSlots: { 
        type: String
    },
    orderDeliveryTime: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    restaurantId:{
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
