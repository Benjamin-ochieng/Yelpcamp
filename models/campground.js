const mongoose = require('mongoose');
const Comment = require('./comment');


let campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    location:String,
    lat:Number,
    lng:Number,
    price:String,
    description:String,
    createdAt: {type:Date, default:Date.now},
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
    }],

    ratings:{
        type:Number,
        default:0,
    }
});

campgroundSchema.pre('remove',function(next){
    Comment.deleteMany({"_id":{$in:this.comments}},(err)=>{
        if(err)return next(err);
        next()
    })
});


let Campground = mongoose.model('campground',campgroundSchema);

module.exports = Campground;

