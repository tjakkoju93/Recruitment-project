const express = require("express")
require("dotenv")
const app = express()

const port = process.env.PORT || 5420

app.use(express.json())

require('./connection/db')

const userRouter = require('./routes/userRoutes')
const jobRouter = require('./routes/jobRouter')

app.use('/api/v1/user',userRouter)
app.use('/api/v1/jobs',jobRouter)


app.listen (port,()=>{
    console.log(`connected to port ${port}`)
})