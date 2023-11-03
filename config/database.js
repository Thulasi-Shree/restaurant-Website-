const mongoose = require('mongoose');


const connectDatabase = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/schemaDraft',{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    })
}

module.exports = connectDatabase;  

