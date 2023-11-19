const JWT = require('jsonwebtoken')
// secret Signature 
const JWT_Secret = "This is Sharad's Signature"

const fetchuser = (req,res,next) =>{

    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({error : "Authenticate with valid token"})
    }

    try {
        const data = JWT.verify(token, JWT_Secret)
        req.user= data.user   
        next()
        
    } catch (error) {
        return res.status(401).send({error : "Authenticate with valid token" , message : error.body})
    }        
}



module.exports = fetchuser