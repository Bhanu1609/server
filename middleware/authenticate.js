const jwt = require("jsonwebtoken");
const Student = require('../model/studentSchema');

const Authenticate = async (req, res, next) => {

    try{

      const token = req.cookies.jwtoken;
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

      const rootStudent = await Student.findOne({ _id: verifyToken._id, "tokens:token": token});

      if(!rootStudent) {
        throw new Error("Student not found")
      }

      req.token = token;
      req.rootStudent = rootStudent;
      req.studentID = rootStudent._id;

    }catch(err){
        res.status(401).send("Unauthorized: No token provided...")
        console.log(err);
    }

}

module.exports = Authenticate;