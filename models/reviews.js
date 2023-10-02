const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Campground = require('./campgrounds');



const reviewSchema = new Schema({
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

const review = mongoose.model('Review',reviewSchema);

module.exports = review;