const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")});
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) );
const helmet = require('helmet');
const morgan = require('morgan');
const initializeWebSocketServer = require('./utils/websocket');


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });

const corsOptions = {
  origin: ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001'] ,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
const transaction = require('./routes/transaction')
const location = require('./routes/location')
const carousal = require('./routes/carousal')
const category = require('./routes/category')


app.use('/api',category);
app.use('/api',auth);
app.use('/api',admin);
app.use('/api',menu);
app.use('/api',review);
app.use('/api',restaurant);
app.use('/api',cart);  
app.use('/api', address);
app.use('/api', promotion);
app.use('/api', feedback);
app.use('/api', userActivity);
app.use('/api', order);
app.use('/api', transaction);
app.use('/api', location);
app.use('/api', carousal);

app.use(helmet()); 


// const corsOptions = {
//   origin: 'http://localhost:3000', 
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

app.use(morgan('combined'));  
const server = http.createServer(app);
initializeWebSocketServer(server);
server.listen(5000, () => {
    console.log('WS Server listening on port 5000');
  });

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}
app.use(errorMiddleware)

module.exports = app;