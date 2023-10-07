const campground = require('../models/campgrounds');
const booking = require('../models/bookings');
const isAuthorized =async function(req,res,next){
    const {id} = req.params;
    const camp = await campground.findById(id)
    if(camp.author.equals(req.user._id)){
        return next();
    }else{
        req.flash('error','You are not Authorized to perform this function')
        res.redirect(`/camps/${id}`);
    
    }
}

const isBookingAuthorized = async function(req,res,next){
    const {id} = req.params;
    const books = await booking.findById(id)
    if(books.user.equals(req.user._id)){
        return next();
    }else{
        req.flash('error','You are not Authorized to perform this function')
        res.redirect(`/camps/${id}`);
    
    }
}

module.exports = {isAuthorized,isBookingAuthorized};