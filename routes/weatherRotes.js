const express= require("express"); 
const WeatherRouter=express.Router();
const {WeatherModel}=require("../models/weather.model")

WeatherRouter.post("/",(req,res)=>{
    const {city}=req.body;
    WeatherModel.find({city:city},(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});