const express = require('express')
const app = express()
const {ErrorMiddleware} = require('./middleware/Error')
const userRoute = require('./routes/user')
const cors = require('cors')



app.use(express.json())

app.use(cors({origin:true,credentials:true}))
const cookieParser = require('cookie-parser')

app.use(cookieParser())
// app.use('/api',cors({origin:true,credentials:true}));



app.use('/user',userRoute)

app.use(ErrorMiddleware)
module.exports = app          