const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const AdminSchema = new mongoose.Schema({
    ename: String,
    username:String,
    designation: String,
    password: String
});


AdminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", AdminSchema);