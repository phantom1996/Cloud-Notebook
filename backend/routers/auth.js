const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

const router = express.Router();


// To create a new user without login required
router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Enter a Valid Password").isLength({ min: 6 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        //send error message
        return res.status(400).json({ error: error.array() })
    }

    //Checking if Email already Exist in the databse
    let Exuser = await User.findOne({ email: req.body.email })
    if (Exuser) {
        return res.status(400).json({ messgae: "Email already Exist , Login using that Email" })
    }

    try {
        //making hashable password using salt also 
        const salt = await bcrypt.genSalt(10)
        const secure_password = await bcrypt.hash(req.body.password , salt)

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secure_password
        })

        res.json(user)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Some error occured", message: error.message })
    }
})

module.exports = router