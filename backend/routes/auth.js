const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.post('/', (req, resp) => {
    
    const user = User(req.body);
    user.save()
    console.log(req.body);
    resp.send(req.body);
})

module.exports = router