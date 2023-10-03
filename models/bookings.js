const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Campground = require('./campgrounds')
const User = require('./user')

const bookingSchema = new Schema({
    from:{
        type:Date,
        require:true
    },
    to:{
        type:Date,
        require:true
    },
    camp:{
        type:Schema.Types.ObjectId,
        ref:'Campground'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
    

})




const booking = mongoose.model("Booking",bookingSchema);


module.exports = booking;