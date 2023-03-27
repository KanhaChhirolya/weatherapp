const express = require('express');

const app = express();
require("dotenv").config();
const redis = require("redis")

const {connection} = require("./configs/db")
const {userRouter} = require("./routes/UserRoutes")
const {authenticator} = require("./middlewares/authentication.middleware")

app.use(express.json());

// const redisClient = redis.createClient()
//     try {
//         redisClient.connect();
//     } catch (error) {
//         console.log(error.msg)
//     }

    

    

app.use("/user",userRouter)
app.use(authenticator)


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to Database")
    }
    catch(err)
    {
        console.log(err)
    }
    console.log(`server is listining at ${process.env.port}`)
})