const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const path = require('path')

const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')


dotenv.config();
connectDB();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.PORT


app.use("/api/users", userRoutes)

app.listen(PORT, ()=>{
    console.log(`Server in Running on Port ${PORT}`)
})

