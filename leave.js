const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const LeaveSchema = new mongoose.Schema({
    username:String,
    leave: Object
});


// LeaveSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Leave", LeaveSchema);