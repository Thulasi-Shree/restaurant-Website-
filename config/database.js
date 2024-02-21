// const mongoose = require('mongoose');


// const connectDatabase = ()=>{
//     mongoose.connect('mongodb://127.0.0.1:27017/schemaDraft',{
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     }).then(con=>{
//         console.log(`MongoDB is connected to the host: ${con.connection.host} `)
//     })
// }

// module.exports = connectDatabase;  
const mongoose = require('mongoose');
require('dotenv').config();

const connectDatabase = () => {
    // Choose the database URI based on the environment
    const dbUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.DB_LOCAL_URI;

    mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    }).catch(err => {
        console.error(`Error connecting to MongoDB: ${err}`);
    });
}

module.exports = connectDatabase;
