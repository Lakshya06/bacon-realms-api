const router = require("express").Router();
const {User} = require("../models/user");
const joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    console.log('hi');
    try{
        console.log("try");
        const {error} = validate(req.body);
        if(error)
            return res.status(400).send({message: error.details[0].message});

        const user = await User.findOne({username: req.body.username});
        if(!user)
            return res.status(401).send({message: "Invalid Username or Password"});

        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );

        if(!validPassword)
            return res.status(401).send({message: "Invalid Username or Password"});

        const token = user.generateAuthToken();
        res.status(200).send({data: token, message: "Logged in successfully"})
        console.log("Logged in")

    }catch(error){
        console.log(error);
        res.status(500).send({message: "Internal Server Error"});
    }
})

const validate = (data) => {
    const schema = joi.object({
        username: joi.string().required().label("username"),
        password: joi.string().required().label("password")
    });
    return schema.validate(data);
}

module.exports = router;