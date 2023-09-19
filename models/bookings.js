const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Campground = require('./campgrounds')

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
    }
    

})

const booking = mongoose.model("Booking",bookingSchema);


module.exports = booking;