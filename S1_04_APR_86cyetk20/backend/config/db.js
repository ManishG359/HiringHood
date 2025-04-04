const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect("mongodb+srv://manishchandraguturu4:dGBg3wrmwQjqubj7@cluster0.67vhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
