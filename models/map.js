const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mapSchema = new Schema({
    token:{
        type:String,
        required:true
    },
    expires:{
        type:Number,
        required:true
    }
})



const map = mongoose.model('Map',mapSchema);

module.exports = map;