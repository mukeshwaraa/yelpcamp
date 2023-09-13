const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
})

const review = mongoose.model('Review',reviewSchema);

module.exports = review;