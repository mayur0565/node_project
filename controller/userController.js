const userModel = require("../model/userModel");
const {isUserExist,PasswordMatch,generateOtp,storeOtp,verifyOtp} = require('../common/commonFunctons')
const {ErrorHandler} = require('../utils/errorHandler')
const {catchAsyncError} = require('../middleware/catchAsyncError')
const {generateJwt} = require('../common/jwtHelper')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const {sendmail} = require('../common/emailHelper');



module.exports.register = catchAsyncError(async function (req, res, next) {
   const request = req.body;

   if(!request.full_name || !request.email || !request.password)
   return next(new ErrorHandler("Please provide all fields", 400));

  const isExist = await isUserExist(request.email)
  if(isExist.length > 0)
  return next(new ErrorHandler('user already exist'))
       
   userModel.register(request.full_name, request.email, request.password);
   res.status(200).json({
     status : 1,
     message : 'user registered successfully'
   })
         
}
)

module.exports.login = catchAsyncError(async function (req, res, next) {
  const response = {}
  const request = req.body;

  if(!request.email || !request.password)
  return next(new ErrorHandler("please provide all fields",401))
  
  const userData = await isUserExist(request.email)

  if(userData.length == 0)
  return next(new ErrorHandler("user not register with this email",404))


  const isPassMatch = await PasswordMatch(request.email,request.password)
  if(!isPassMatch)
  return next(new ErrorHandler("invalid email or password"))
  let token = generateJwt()
  console.log(token);

  res.cookie("token",token,{httpOnly: true});
  res.send({"token":token})
})



module.exports.logout = catchAsyncError(async function(req,res,next){
res.status(200).cookie("token",null,{expires: new Date(Date.now())}).json({
  message : 'logout successfully'
})
}) 

module.exports.home = catchAsyncError(async function(req,res,next){
  res.send("welcome to dashboard")
})   

module.exports.forgotPassword = catchAsyncError(async function(req,res,next){
      
  const {email,user_id} = req.body
  if(!email)
  return next(new ErrorHandler("please provide all fields",401))
   
  const otp = await generateOtp()

  const storedOtp = await storeOtp(email,otp)

  if(storedOtp == 1)
  return next(new ErrorHandler("otp already share on your email",401))
  
  sendmail(email,otp)
  res.status(200).send({message:"otp send on your email address"})

}) 


module.exports.resetPassword = async (req,res,next) =>{
  const response = {}
  const {email,new_password} = req.body
  if(!email || !new_password)
  return next(new ErrorHandler('please enter valid parameter'))
  userModel.updatePassword(email,new_password)

  response.status = 1
  response.message = 'password change successfully'
  res.send(response)
}

module.exports.verifyOtp = async function(req,res,next){
  const response = {}

  const {otp,email} = req.body
  if(!otp || !email)
  return next(new ErrorHandler('please enter valid parameter'))

    const isverify = await verifyOtp(otp,email)
    console.log(isverify);
    if(isverify == 1){
      response.isverify = 1
      response.message = 'otp match'
    }else{
      response.isverify = 0
      response.message = 'invalid otp or expired otp'
    }
    res.send(response)
  }
