const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  street: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  postalCode: {
    type: String,
    required: true,
  },
  
  country: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    default: null,
},
longitude: {
    type: Number,
    default: null,
}
});

const Address = mongoose.model('Address', addressSchema, 'address');

module.exports = Address;
