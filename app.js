
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path')

// const bodyParser = require('body-parser')


const auth = require('./routes/auth')
const admin = require('./routes/admin')
const menu = require('./routes/menu')
const review = require('./routes/review')
const restaurant = require('./routes/restaurant')
const cart = require('./routes/cart')
const address = require('./routes/address')
const promotion = require('./routes/promotion')
const feedback = require('./routes/feedBack')
const userActivity = require('./routes/userActivity')
const order = require('./routes/order')
// const category = require('./routes/category')

const dotenv = require('dotenv');

dotenv.config({path:path.join(__dirname,"config/config.env")});


app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended}))


// app.use('/api/',category);
app.use('/api/',auth);
app.use('/api/',admin);
app.use('/api/',menu);
app.use('/api/',review);
app.use('/api/',restaurant);
app.use('/api/',cart);
app.use('/api/', address);
app.use('/api/', promotion);
app.use('/api/', feedback);
app.use('/api/', userActivity);
app.use('/api/', order);

module.exports = app;