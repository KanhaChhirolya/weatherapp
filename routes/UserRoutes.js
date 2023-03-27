const express= require("express"); 
const userRouter=express.Router();
const {userModel}=require("../models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const fs=require("fs")

userRouter.get("/",async(req,res)=>{
    res.send("Hello World")
})

userRouter.post("/login",async (req, res) => {
    
    try {
    const { email, password } = req.body;

    const isUserPresent = await userModel.findOne({ email });

    if (!isUserPresent){
        return res.send("User not present, register please");
    }

    const isPasswordCorrect = await bcrypt.compareSync (password,isUserPresent.password);

    if (!isPasswordCorrect) {
        return res.send("Invalid credentials");
    }
    const token = await jwt.sign({ email, userId: isUserPresent._id, role: isUserPresent.role },process.env.token_key,{ expiresIn: "30min" });

    const refreshToken = await jwt.sign({ email, userId: isUserPresent._id },process.env.ref_token_key,{expiresIn: "30min"});

    res.send({ msg: "Login success", token, refreshToken });

    } catch (error) {
    res.send(error.message);
    }
}
);

userRouter.post("/register",async(req,res)=>{
    const {email,password,name}=req.body;
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.send({msg:"something went wrong",error:err.message})
            }else{
                const User= new userModel({name,email,password:hash});
                await User.save();
                res.send({msg:"New user has been registered"})
            }
        })
        
    } catch (error) {
        res.send({msg:"something went wrong",error:error.message})
    }
})

userRouter.get("/getnewtoken",async(req,res)=>{
    const refreshToken=req.headers.authorization.split(" ")[1];
    if(!refreshToken) res.send({msg:"plz login again"})

    jwt.verify(refreshToken,process.env.ref_token_key,async(err,decoded)=>{
        if(!decoded){
            res.send({msg:"plz login again",error:err})
        }else{
            const token = await jwt.sign({email:decoded.email,userId:decoded.userId},process.env.token_key,{ expiresIn: "30min" });
            res.send({msg:"Login Successfull and New token genrated successfully",Token:token})
        }
    })
})

userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    try {
        const value = await redisClient.get("token")
    const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    blacklist.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklist));
    res.status(200).send({msg:"Logout Successfull"})
    } catch (error) {
    res.send({msg:"something went wrong",err:error.message})
    }

})


module.exports={
    userRouter
}

// app.get("/",async(req,res)=>{
   
//     console.log(value)
//     res.send("this is home page")
// }) 

































// const express = require('express');
// const app = express();

// const {UserModel} = require("../models/user.model")
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")
// const fs = require("fs");

// const userRouter = express.Router();

// userRouter.post("/register",async(req,res)=>{
//       const {email,name,password} = req.body;

//       try {
//         bcrypt.hash(password,5,async(err,hash)=>{
//             if(err){
//                 res.send({msg:"something wnet wrong",error:err.msg})
//             }else{
//                 const user = new UserModel({email,name,password:hash});
//                 await user.save();
//                 res.send({msg:"user registered successfully"})
//             }
//         })
//       } catch (error) 
//       {
//         res.send({msg:"something wnet wrong",error:error.msg})
//       }
// })

// userRouter.post("/login",async(req,res)=>{
//     try {
//         const {email,password} = req.body
//         const isUserpresent = await UserModel.findOne({email});
//         if(!isUserpresent){
//             return res.sendStatus("user not found register please");
//         }

//         const isPasswordcorrect = await bcrypt.compareSync(password,isUserpresent.password)

//         if(!isPasswordcorrect){
//             return res.send("wrong password");
//         }
//           const token = await jwt.sign({email,userId:isUserpresent,role:isUserpresent.role},procees.env.token_key,{expiresIn:"30m"})

//           const refreshtoken = await jwt.sign({email,userId:isUserpresent,},procees.env.ref_token_key,{expiresIn:"30m"})
            
//           res.send({msg:"login success",token,refreshtoken})
//     } catch (error) {
//         res.send({msg:"something wnet wrong",error:error.msg})
//     }
// })

// userRouter.get("/getnewtoken",async(req,res)=>{
//     const refreshToken=req.headers.authorization.split(" ")[1];
//     if(!refreshToken) res.send({msg:"plz login again"})

//     jwt.verify(refreshToken,process.env.ref_token_key,async(err,decoded)=>{
//         if(!decoded){
//             res.send({msg:"plz login again",error:err})
//         }else{
//             const token = await jwt.sign({email:decoded.email,userId:decoded.userId},process.env.token_key,{ expiresIn: "7d" });
//             res.send({msg:"Login Successfull and New token genrated successfully",Token:token})
//         }
//     })
// })

// userRouter.get("/logout",async(req,res)=>{
//     const token=req.headers.authorization.split(" ")[1];
//     try {
//     const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
//     blacklist.push(token);
//     fs.writeFileSync("./blacklist.json",JSON.stringify(blacklist));
//     res.status(200).send({msg:"Logout Successfull"})
//     } catch (error) {
//     res.send({msg:"something went wrong",err:error.message})
//     }

// })

// module.exports = {userRouter};


