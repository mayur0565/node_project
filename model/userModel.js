const connection = require("../common/db_connection")
const bcrypt = require('bcrypt')

module.exports.register = async (name,email,password) =>{
    let saltRount = 10
    let hashPassword = await bcrypt.hash(password,saltRount)

    let insertData = {
      full_name  : name,
      email : email,
      password : hashPassword
    }
  
    let sql1 = "insert into tb_users set ?"
    connection.executeQuery(sql1,[insertData])
}

module.exports.updatePassword = async (email,newPassword) =>{
  let saltRount = 10
  const hashPassword = await bcrypt.hash(newPassword,saltRount)

  let sql1 = "update tb_users set password = ? where email = ?"
  const result = await connection.executeQuery(sql1,[hashPassword,email])
  console.log(result);
}

