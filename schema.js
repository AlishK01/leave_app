const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const EmployeeSchema = new mongoose.Schema({
    ename: String,
    image: String,
    username:String,
    about: String,
    designation: String,
    password: String
});


EmployeeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Employee", EmployeeSchema);