const jwt = require('jsonwebtoken')
const User = require('../models/Users')

module.exports.authenticate = async(req, res, next) => {

    let token;
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select("-password")
            next()
        } catch (error) {
            res.status(401).send(
                "Not Authorized, Token Failed"
            )
        }
    } else {
        res.status(401).send("Not Authorized, No token found")
    }
}


module.exports.authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }
    else{
        res.status(401).send("You are not authorized")
    }
}

