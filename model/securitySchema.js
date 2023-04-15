const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const securitySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    employeeid: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    gender: {
         type: String,
         required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

})



// hashing the password
securitySchema.pre('save', async function (next) {
    if(this.isModified('Password')) {
        this.Password = await bcrypt.hash(this.Password, 12);
        this.confirmPassword =await bcrypt.hash(this.confirmPassword, 12);
    }
    next();
})

// generating token
securitySchema.methods.generateAuthToken = async function () {
    try {
      
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token

    }catch (err){
        console.log(err);
    }
}

const Security = mongoose.model('SECURITY', securitySchema);

module.exports = Security;