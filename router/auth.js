const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const Student = require('../model/studentSchema');

router.get('/', (req,res) => {
    res.send("Hello from server router.js..");
});

// using promises
// router.post('/stud ent-register', (req, res) => {

//     const { fullname, username, password, confirmpassword, registrationnumber, rollnumber, email, gender, currentyear, mobilenumber, course, branch } = req.body;

//     if(!fullname || !username || !password || !confirmpassword || !registrationnumber || !rollnumber || !email || !gender || !currentyear || !mobilenumber || !course || !branch){
//         return res.status(422).json({ error: "Please fill all the fields..."})
//     }
//     Student.findOne({ username: username, email:email })
//     .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({ error: "User already exist..."})
//         }

//         const student = new Student({ fullname, username, password, confirmpassword, registrationnumber, rollnumber, email, gender, currentyear, mobilenumber, course, branch });

//         student.save().then(() => {
//             res.status(201).json({ message: "Student registered successfully..." })
//         }).catch((err) => res.status(500).json({ error: "Failed to register..." }))

//     }).catch(err => { console.log(err); })
    
// });

// Async-Await
router.post('/student-register', async (req, res) => {

    const { fullname, username, password, confirmpassword, registrationnumber, rollnumber, email, mobilenumber } = req.body;

    if(!fullname || !username || !password || !confirmpassword || !registrationnumber || !rollnumber || !email || !mobilenumber ){
        return res.status(422).json({ error: "Please fill all the fields..."})
    }

    try {
        const userExist = await Student.findOne({ username: username, email:email })

        if(userExist){
            return res.status(422).json({ error: "User already exist..."})
        } else if (password != confirmpassword) {
            return res.status(422).json({ error: "Passwords are not matching..."})
        } else {
            const student = new Student({ fullname, username, password, confirmpassword, registrationnumber, rollnumber, email, mobilenumber });


        
            const studentRegister = await student.save();
    
            if (studentRegister) {
                res.status(201).json({ message: "Student registered successfully..." })
            } else {
                res.status(500).json({ error: "Failed to register..." })
            }
        }

        
    }catch(err) {
        console.log(err);
    }
    
    
});

// login route

router.post('/student-login', async (req, res) => {
    try {
      let token;
      const { username, password } = req.body

      if(!username || !password){
        return res.status(400).json({ error: "Please fill allthe details..." })
      }

      const studentLogin = await Student.findOne({username: username})

    //   console.log(studentLogin);
      

      
      if(!studentLogin) {
        res.status(400).json({ error: "User not found..." })
      }else {
        const isMatch = await bcrypt.compare(password, studentLogin.password);

        token = await studentLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
            expires:new Date(Date.now() + 2592000000),
            httpOnly:true
        });

        if(!isMatch){
            res.status(400).json({ error: "Invalid Password..." })
          }else {
            res.json({ message: "Student Login successful..." })
          }
      }

      

    }catch(err) {
        console.log(err);
    }
})

module.exports = router;