const mongoose = require('mongoose')

const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log("DB Connection Successful...");
}).catch((err) => console.log("DB Not connected..."))