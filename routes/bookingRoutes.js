const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap'); 
const bookingValidator = require('../utils/bookingValidator')
const flash = require('connect-flash')
const passport = require('passport');
const isAuthenticated = require('../utils/isAuth')
const {isBookingAuthorized} = require('../utils/isAuthorized')
const campground = require('../models/campgrounds');
const user = require('../models/user');
const booking = require('../models/bookings')


router.get('/:id',isAuthenticated, asyncWrap( async(req,res,next) =>{
    const {id} = req.params;
    const camp = await campground.findById(id);
   res.render('booking',{camp})
}))
router.post('/:id',isAuthenticated,bookingValidator,asyncWrap( async(req,res,next) =>{
    const {booking:books} = req.body;
    const{id} = req.params;
    const {id:id1} = req.user;
    console.log(id1);
    const users = await user.findById(id1);
    const ca = await campground.findById(id);
    const book = new booking({...books});
    book.camp = id;
    book.user = users
    await book.save().then(async(doc) =>{
        req.flash('success','Booking successfully created')
        ca.bookings.push(book);
        await ca.save();
        users.bookings.push(book);
        await users.save();
        res.redirect('/camps/showbooks')
    });

}))
router.delete('/:id',isAuthenticated,isBookingAuthorized,asyncWrap(async (req,res,next) =>{
    const {id} = req.params;
    const books = await booking.findById(id).populate('camp').populate('user');
    const bid = books.id
    const cid = (books.camp.id)
    const uid = (books.user.id)
    await campground.findByIdAndUpdate(cid,{$pull: {bookings:bid}})
    await user.findByIdAndUpdate(uid,{$pull: {bookings:bid}})
    await books.deleteOne()
    req.flash('success','Booking successfully Deleted');
    res.redirect('/camps/showbooks')
}))
router.get('/:id1/:id2',isAuthenticated,asyncWrap(async (req,res,next) =>{
    const {id1,id2} = req.params;
    const book = await booking.findById(id2)
    const camp = await campground.findById(id1).populate({path:
        'reviews',
    populate:{  
        path:'author'
    }}).populate({path:'bookings',
        populate:{
            path:'user'
        }});
    //     console.log(book)
    //  console.log(camp)   
    res.render('bookingDetails',{camp,book})
}))


module.exports = router