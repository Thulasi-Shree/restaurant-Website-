const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  restaurantId: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
},
  numOfReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    set: value => parseFloat(value.toFixed(2)),
  },
  cuisineTypeCategory: {
    type: String,
    enum: [
        'Italian',
        'Asian',
        'Chinese',
        'Indian',
        'Mexican',
        'Other'
    ],
    required: true,
},
  dietaryPreferenceCategory: {
        type: String,
        enum: [
            'Vegetarian',
            'Non-vegetaria',
            'Vegan',
            'Gluten-Free',
            'Halal',
            'Other'
        ],
        required: true,
    },
  
  openingHours: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
