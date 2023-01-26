const jwt = require("jsonwebtoken")
const{User} = require("../models")

const authenticate = async (req,res, next) => {
    try {
        if (!req.headers.access_token){
            throw {message:"forbidden"}
        }

        let {access_token} = req.headers
        let checkToken = jwt.verify(access_token, "12345")

        if(!checkToken){
            throw {message:"forbidden"}
        }

        let user = await User.findByPk(checkToken.id)

        if(!user){
            throw {message:"forbidden"}
        }

        req.user = {id:user.id}

        next()
    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports = authenticate