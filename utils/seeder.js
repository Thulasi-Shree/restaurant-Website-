const menus = require('../data/menus.json');
const Menu = require('../model/menuItem');

const address = require('../data/address.json');
const Address = require('../model/Address');

const cart = require('../data/carts.json');
const Cart = require('../model/cart');

const feedback = require('../data/feedbacks.json');
const Feedback = require('../model/feedback');

const location = require('../data/locations.json');
const Location = require('../model/Location');

const orders = require('../data/orders.json');
const Orders = require('../model/order');

const promotion = require('../data/promotions.json');
const Promotion = require('../model/promotion');

const restaurant = require('../data/restaurants.json');
const Restaurant = require('../model/restaurant');

const reviews = require('../data/reviews.json');
const Reviews = require('../model/review');

const timeslot = require('../data/timeslots.json');
const Timeslot = require('../model/timeSlot');

const userActivity = require('../data/useractivities.json');
const UserActivity = require('../model/userActivity');

const user = require('../data/users.json');
const User = require('../model/user');

const dotenv = require('dotenv');
const connectDatabase = require('../config/database')

dotenv.config({path:'../config/config.env'});
connectDatabase();

const seedProducts = async () => {
    try {
        // Delete existing data from the respective collections
        // await Menu.deleteMany();
        // await Restaurant.deleteMany();
        // await Address.deleteMany();
        await Cart.deleteMany();
        await Feedback.deleteMany();
        // await Location.deleteMany();
        await Orders.deleteMany();
        await Promotion.deleteMany();
        await Reviews.deleteMany();
        await Timeslot.deleteMany();
        await UserActivity.deleteMany();
        await User.deleteMany();

        // Insert new data from the JSON files into the respective collections
        // await Menu.insertMany(menus);
        // await Restaurant.insertMany(restaurant);
        await Address.insertMany(address);
        await Cart.insertMany(cart);
        await Feedback.insertMany(feedback);
        // await Location.insertMany(location);
        await Orders.insertMany(orders);
        await Promotion.insertMany(promotion);
        await Reviews.insertMany(reviews);
        await Timeslot.insertMany(timeslot);
        await UserActivity.insertMany(userActivity);
        await User.insertMany(user);

        console.log('Data seeded successfully!');
    } catch (error) {
        console.error(error.message);
    }
    // Close the connection after seeding the data
    process.exit();
};

seedProducts();