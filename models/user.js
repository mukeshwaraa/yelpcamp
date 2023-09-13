const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
})

const user = mongoose.model('User',userSchema);

module.exports = user;