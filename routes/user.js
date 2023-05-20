const express = require('express')
const router = express.Router()
const {verifyJwt} = require('../common/jwtHelper')
const userController = require('../controller/userController')

router.post('/register',(req,res,next)=>{
    userController.register(req,res,next)
})

router.post('/login',(req,res,next)=>{
    userController.login(req,res,next)
})

router.get('/home',verifyJwt,(req,res,next)=>{
    userController.home(req,res,next)
})

router.post('/logout',(req,res)=>{
    userController.logout(req,res)
})

router.post('/verifyOtp',(req,res,next)=>{
    userController.verifyOtp(req,res,next)
})


router.post('/forgot_password',(req,res,next)=>{
    userController.forgotPassword(req,res,next)
})

router.post('/reset_password',(req,res,next)=>{
    userController.resetPassword(req,res,next)
})

module.exports = router