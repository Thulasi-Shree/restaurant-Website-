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
    const atlasConnectionUri = process.env.MONGODB_URI;

    mongoose.connect(atlasConnectionUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    }).catch(err => {
        console.error(`Error connecting to MongoDB: ${err}`);
    });
}

module.exports = connectDatabase;
