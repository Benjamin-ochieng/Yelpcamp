const mongoose = require('mongoose');



let campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    location:String,
    lat:Number,
    lng:Number,
    price:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username:String,
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
});

let Campground = new mongoose.model('campground',campgroundSchema);

module.exports = Campground;

