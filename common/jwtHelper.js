const jwt = require('jsonwebtoken')
require('dotenv').config()
const {ErrorHandler} = require('../utils/errorHandler')

module.exports.generateJwt = function(req,res,next){
return jwt.sign({data:"ghdg"},process.env.SECRET_KEY,{ expiresIn:'1min'})
}

module.exports.verifyJwt = function(req,res,next){
    let {token}=req.cookies;

   if(!token)
   return next(new ErrorHandler('unauthonticate user',400))

   jwt.verify(token,process.env.SECRET_KEY)
   next()
}   
