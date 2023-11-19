const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const JWT = require('jsonwebtoken')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
// secret Signature 
const JWT_Secret = "This is Sharad's Signature"

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
        const secure_password = await bcrypt.hash(req.body.password, salt)

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secure_password
        })

        const Data = {
            user: {
                id: user.id
            }
        }
        const authToken = JWT.sign(Data, JWT_Secret)

        res.json({ authToken })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Some error occured", message: error.message })
    }
})


// To Authenticate user without login required
router.post('/login', [
    body('email', "Enter a valid Email").isEmail()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        //send error messagea if E-mail not a valid Email
        return res.status(400).json({ error: error.array() })
    }

    //const { user_email, user_password } = req.body;

    const email = req.body.email
    const password = req.body.password

    console.log(req.body)

    try {
        //Checking if Email  Exist in the databse
        let Cur_user = await User.findOne({ email })
        if (!Cur_user) {
            return res.status(400).json({ message: "Login with Correct Credentials" })
        }

        //checking for correct password
       // console.log(user_password , req.body.password, Cur_user.password)
        const authPassword = await bcrypt.compare(password, Cur_user.password)

        if (!authPassword) {
            res.status(400).json({ message: "Login with Correct Credentials" })
        }

        const Data = {
            user: {
                id: Cur_user.id
            }
        }
        const authToken = JWT.sign(Data, JWT_Secret)

        res.json({ authToken })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Some error occured", message: error.message })
    }
})

// To get user details login required ed point /getuser
//Using a middle ware to get the id of the user, using Token
router.post('/getuser', fetchuser , async (req, res) => {
    try {
        const userid = req.user.id
        console.log(userid)
        const user = await User.findById(userid).select("-password")
        console.log(user)
        res.json({user})
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})
module.exports = router