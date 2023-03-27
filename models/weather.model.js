const mongoose=require("mongoose");
 
 const WeatherSchema = mongoose.Schema({
    city:{type:String,required:true}
   })

 const WeatherModel=mongoose.model("userweather",WeatherSchema);

 module.exports={
    WeatherModel
 }