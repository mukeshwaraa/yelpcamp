const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bookings = require('./bookings')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    bookings:[
        {
            type:Schema.Types.ObjectId,
            ref:'Booking'
        }
    ]
})
userSchema.plugin(passportLocalMongoose);
const user = mongoose.model('User',userSchema);

module.exports = user;