const mongoose = require('mongoose');

const notficationSchema = new mongoose.Schema({
    username:String,
    campgroundId: String,
    isRead:{type:Boolean, default:false}
});

const Notification =  mongoose.model('Notification',notficationSchema);

module.exports = Notification;