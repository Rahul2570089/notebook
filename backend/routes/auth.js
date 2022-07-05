const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')


const JWT_TOKEN = 'hi';


router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must atleast 7 characters').isLength({ min: 7 })
], async (req, resp) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return resp.status(400).json({ error: "User with this email already exists" })
        }
        const salt = await bcrypt.genSalt(19)
        secpass = await bcrypt.hash(req.body.password, salt) 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_TOKEN);
        success = true
        resp.json({success, authtoken})
    } catch (error) {
        console.error(error.message)
        req.status(500).send("Internal server error occured")
    }
})


router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, resp) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() })
    }

    const {email,password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user) {
            success = false
            return resp.status(400).json({error: 'Please enter correct credentials'})
        }
        const passwordcompare = await bcrypt.compare(password, user.password)
        if(!passwordcompare) {
            success = false
            return resp.status(400).json({success ,error: 'Please enter correct credentials'})
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_TOKEN);
        success = true
        resp.json({success, authtoken})

    } catch (error) {
        console.error(error.message)
        req.status(500).send("Internal server error occured")
    } 

})

router.post('/getuser',fetchuser, async (req, resp) => {
try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    resp.send(user)
} catch (error) {
    console.error(error.message)
    req.status(500).send("Internal server error occured")
}
})
module.exports = router