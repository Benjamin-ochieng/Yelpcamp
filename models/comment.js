const mongoose = require('mongoose');


let commentSchema = new mongoose.Schema({
    rating:{
        type:Number,
        required:'Please provide a rating (1-5 stars).',
        min:1,
        max:5,
        validate:{
            validator:Number.isInteger,
            message:'{VALUE} is not an integer'
        }

    },
    text:String,
    createdAt: {type:Date, default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username:String
    }
});


let Comment = new mongoose.model('Comment',commentSchema);

module.exports = Comment;