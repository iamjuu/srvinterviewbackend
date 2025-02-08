const mongoose = require("mongoose");

const mongodbconnect = async () => {
  try {
    const Dburl = process.env.MONGOURI || "mongodb://127.0.0.1:27017/notificationsrv";  // Fallback URI
    await mongoose.connect(Dburl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("MongoDB not connected", err);
  }
};

module.exports = mongodbconnect;


