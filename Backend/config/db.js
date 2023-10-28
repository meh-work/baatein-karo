const connectDB = async() => {
    try{
        const mongoose = require("mongoose");
        mongoose.set('strictQuery', true);

        const db = 'mongodb+srv://mehworkwithme:I6Jv2EO3CZ7uU2BE@cluster0.5ugwbvz.mongodb.net/?retryWrites=true&w=majority'
        const conn = await mongoose.connect(db,{
            useFindAndModify: false,
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }catch(error){
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
};

module.exports=connectDB;