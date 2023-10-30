const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter food item name"],
        trim: true,
        maxLength: [100, "Food item name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter food item description"]
    },
    ratings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    mealTypeCategory: {
        type: String,
        enum: [
            'Appetizers',
            'Main Course',
            'Desserts',
            'Beverages',
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
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, "Please specify the restaurant"]
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    availableDate: {
        type: Date, 
    },
    isPreOrderAvailable: {
        type: Boolean,
        default: false 
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    preparationTime: Date,
    lastEdited: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
