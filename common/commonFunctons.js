const connection = require("../common/db_connection")
const bcrypt = require('bcrypt')
const {ErrorHandler} = require('../utils/errorHandler')
const moment = require('moment-timezone')


const currentTimestamp = function () {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
}

module.exports.isUserExist = async function (email){
    const sql = "select * from tb_users where email = ?"
    return await connection.executeQuery(sql,[email])
}

module.exports.PasswordMatch = async function(email,password){
    let userPassword = ''
    const sql = "select password from tb_users where email = ?"
    const result = await connection.executeQuery(sql,email)
    userPassword = result[0].password
    let ismatch = await bcrypt.compare(password,userPassword)
    return ismatch
}

module.exports.storeOtp = async function(email,otp){
    var otpexist = 0

    const insertdata = {email,otp,generated_time:currentTimestamp()}
    const sql = `select id from tb_authentication where email = ?`
    const checkOtpExist = await connection.executeQuery(sql,[email])

    if(checkOtpExist.length > 0){
     otpexist = 1
    }else{
        const sql1 = "insert into tb_authentication set ?"
        connection.executeQuery(sql1,insertdata)
    }
    
    return otpexist

}

module.exports.verifyOtp = async function(otp,email){
  let isverify = 0;
  const sql = `select otp from tb_authentication where email = ? and otp = ? order by id desc limit 1`
  const verifyresult = await connection.executeQuery(sql,[email,otp])
  
  if(verifyresult.length > 0){
    isverify = 1
  }
return isverify

}


module.exports.generateOtp = async  function(){
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
}

