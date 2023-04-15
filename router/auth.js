const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate')

require('../db/conn');
const Student = require('../model/studentSchema');
const Security = require('../model/securitySchema');

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
        return res.status(400).json({ error: "Please fill all the fields..."})
    }

    try {
        const userExist = await Student.findOne({ username: username, email:email })

        if(userExist){
            return res.status(400).json({ error: "User already exist..."})
        } else if (password != confirmpassword) {
            return res.status(400).json({ error: "Passwords are not matching..."})
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

// security-register
router.post('/security-register', async (req, res) => {

    const { fullName, userName, Password, confirmPassword, employeeid, Email, gender, mobileNumber } = req.body;

    if(!fullName || !userName || !Password || !confirmPassword || !employeeid || !gender || !Email || !mobileNumber ){
        return res.status(400).json({ error: "Please fill all the fields..."})
    }

    try {
        const userExist = await Student.findOne({ userName: userName, Email:Email })

        if(userExist){
            return res.status(400).json({ error: "User already exist..."})
        } else if (Password != confirmPassword) {
            return res.status(400).json({ error: "Passwords are not matching..."})
        } else {
            const security = new Security({ fullName, userName, Password, confirmPassword, employeeid, Email, gender, mobileNumber });


        
            const securityRegister = await security.save();
    
            if (securityRegister) {
                res.status(201).json({ message: "Security registered successfully..." })
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
        return res.status(400).json({ error: "Please fill all the details..." })
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

// security login
router.post('/security-login', async (req, res) => {
    try {
      let token;
      const { userName, Password } = req.body

      if(!userName || !Password){
        return res.status(400).json({ error: "Please fill all the details..." })
      }

      const securityLogin = await Security.findOne({userName: userName})

    //   console.log(studentLogin);
      

      
      if(!securityLogin) {
        res.status(400).json({ error: "User not found..." })
      }else {
        const isMatch = await bcrypt.compare(Password, securityLogin.Password);

        token = await securityLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
            expires:new Date(Date.now() + 2592000000),
            httpOnly:true
        });

        if(!isMatch){
            res.status(400).json({ error: "Invalid Password..." })
          }else {
            res.json({ message: "Security Login successful..." })
          }
      }

      

    }catch(err) {
        console.log(err);
    }
})

router.get('/dashboard', authenticate , (req, res) => {
    console.log("Hello from Dashboard!");
    res.send(req.rootStudent);
});

module.exports = router;