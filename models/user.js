// const { required } = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
});

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
};

const User = mongoose.model("user", userSchema); 

const validate = (data) => {
    const schema = joi.object({
        username: joi.string().required().label("username"),
        password: passwordComplexity().required().label("password"),
        // confirmPassword: passwordComplexity().required().label("confirmPassword")
        confirmPassword: joi.any().equal(joi.ref("password")).required().label("confirmPassword").options({messages: {'any.only': 'Password and Confirm Password do no match!'}})
    });
    return schema.validate(data)
};

module.exports = {User, validate};