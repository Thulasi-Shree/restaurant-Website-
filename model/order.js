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
        }
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
        type: Boolean,
        required: true,
        default: false
    },
    pickupTime: {
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
