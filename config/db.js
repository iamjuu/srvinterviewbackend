 const mongoose = require("mongoose")
 const Dburl = process.env.mongourl
 
 console.log(Dburl)
 
 const mongodbconnect =  async ()=>{
     try{
         
const connecting = await mongoose.connect(Dburl)
console.log("mongodb is connected")
}catch(err){

    console.log("mongodb not connected")
console.log(err)
}

 }
 module.exports = mongodbconnect
