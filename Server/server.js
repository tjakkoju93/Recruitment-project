const express = require("express")
require("dotenv")
const app = express()

const port = process.env.PORT || 5420

app.use(express.json())

require('./connection/db')

const userRouter = require('./routes/userRoutes')

app.use('/api/v1/user',userRouter)


app.listen (port,()=>{
    console.log(`connected to port ${port}`)
})