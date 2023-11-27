const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({

  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: Number,
    required: true,
    unique: true,
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
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  // image: {
  //   type: String,
  //   required: true,
  // },
  //   location: {
  //     type: {
  //         type: String,
  //         default: 'Point',
  //     },
  //     coordinates: {
  //         type: [Number], // Array of [longitude, latitude]
  //         index: '2dsphere',
  //     },
  // },
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
      'Non-vegetarian',
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
