const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path:'./config.env' }); 
require('./db/conn');
// const User = require('./model/studentSchema');

app.use(express.json());
// link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT;

// app.get('/', (req,res) => {
//     res.send("Hello from server app.js..");
// })

app.get('/student-login', (req,res) => {
    res.send("Hello from Student login..");
})

app.get('/student-register', (req,res) => {
    res.send("Hello from Student register..");
})

app.get('/about-us', (req,res) => {
    res.send("Hello from About us..");
})


app.listen(PORT, ()=> {
    console.log('Server is running at port',PORT)
})
