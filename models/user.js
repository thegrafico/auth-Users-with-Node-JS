//------------DB connection
var mongoose = require("mongoose");
var passportLocalMongoose 	= require("passport-local-mongoose"); // auth
//--------------

var userSchema = new mongoose.Schema({
	username: String,
	password: String 
});

//add muchos metodos to userSchemma de parte de passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);