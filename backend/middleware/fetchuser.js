const jwt = require('jsonwebtoken')
const JWT_TOKEN = 'hi';

 
const fetchuser = (req,resp,next) => {
    const token = req.header('auth-token')
    if(!token) {
        resp.status(401).send({error: "Please authenticate using a valid token"})
    }

    try {
        const data = jwt.verify(token, JWT_TOKEN)
        req.user = data.user
        next()
    } catch (error) {
        resp.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = fetchuser