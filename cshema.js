const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const CompaintSchema = new mongoose.Schema({
    username:String,
    department: String,
    joindate: String,
    complain: String
});


// LeaveSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model(" Compaint",  CompaintSchema);