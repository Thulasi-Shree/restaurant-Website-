const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({

  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  restaurantBranch: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    line1: {
      type: String,
      default: null,
    },
    line2: {
      type: String,
      default: null,
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
      unique: true
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
    },
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
  pincode: {
    type: String,
    default: () => Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
  },
  // images: [
  //   {
  //     image: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
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
  //   reviews: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Review',
  // },
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
  // dietaryPreferenceCategory: {
  //       type: String,
  //       enum: [
  //           'Vegetarian',
  //           'Non-vegetarian',
  //           'Vegan',
  //           'Gluten-Free',
  //           'Halal',
  //           'Other'
  //       ],
  //       required: true,
  //   },

  openingHours: {
    type: String,
    // required: true,
  },
  isFeatured: {
    type: Boolean,
    // default: false,
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
