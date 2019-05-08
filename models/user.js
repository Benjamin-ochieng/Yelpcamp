const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    email:String,
    profileImage:String,
    isAdmin:{type:Boolean, default:false},
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;