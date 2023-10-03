if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');    
const path = require('path');
const engine = require('ejs-mate');
const campgroundRoute = require('./routes/campgroundRoutes')
const methodOverride = require('method-override'); 
const asyncWrap = require('./utils/asyncWrap'); 
const bookingRoute = require('./routes/bookingRoutes')
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const flash = require('connect-flash')
const passport = require('passport');
const isAuthenticated = require('./utils/isAuth')
const LocalStrategy = require('passport-local');
const axios = require('axios');
const url = 'https://outpost.mappls.com/api/security/oauth/token'
const securityPolicy = require('./utils/helmet')
const MongoDBStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
// import {v2 as cloudinary} from 'cloudinary';
// override with POST having ?_method=DELETE
// use ejs-locals for all ejs templates:
const mongoose = require('mongoose');
// const mongoDB = process.env.DB_URL;
const mongoDB = 'mongodb://127.0.0.1/yelp-camp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log("database connected") });
const campground = require('./models/campgrounds')
const review = require('./models/reviews')
const user = require('./models/user');
const booking = require('./models/bookings')
const map = require('./models/map')
const AppError = require('./utils/error');
const { object } = require('joi');

const tokenfetcher = async function(){
    try{
        m = await map.findById(process.env.map_id)
        tok = m.token
        return tok;
    }
        catch(e){
            console.log(e);
        }
    
    }
    const expiryfetcher = async function(){
        m = await map.findById(process.env.map_id)
        exp = m.expires
        return exp;
    
    }
let map_token;
let token_expiry;
let fetcher = async()=>{
    map_token = await tokenfetcher();
    token_expiry = await expiryfetcher();
}
const app =express();
app.use(mongoSanitize())
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded());
app.use(methodOverride('_method'))
app.use(cookie_parser('secret'))
const store = MongoDBStore.create({
    mongoUrl : mongoDB,
    touchAfter: (24*60*60)
})
store.on('error',(e) =>{
    console.log("Session store Error",e)
})
app.use(session({
    store:store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
    //   secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }
  }))
app.use(flash());
app.use(helmet.contentSecurityPolicy(securityPolicy));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(async(req,res,next) =>{
    // console.log("token expiring",token_expiry)
    if(Date.now() > token_expiry){
        // console.log('hai')
        // console.log(Date.now()) 
        try{
        const response = await axios.post(url,{headers:{'Content-Type' : 'application/x-www-form-urlencoded'}},{params:{grant_type:"client_credentials",client_id:'33OkryzDZsL6Eu0TEt2Ub-8I0OdrwHDBDhiEeWkzeCoAdzEZYUJ0i_lqNeBlxvwzBUHOVD0Xm2uYxi2WeLappA==',client_secret:process.env.map_client_secret}})
        map_token = response.data.access_token;
        token_expiry = (((response.data.expires_in) * 1000) + Date.now())
        await map.findByIdAndUpdate(process.env.map_id,({token:map_token,expires:token_expiry}))

        
        return next()

    }catch(e){
        console.log(e)
        return next()
    }
    }next();
})
app.use((req,res,next) =>{
    // console.log(req.originalUrl)
    // console.log(req.get('Referrer'))
    // // console.log(req.get('Referrer') && req.get('Referrer') !== 'http://localhost:3000/camps/login')
    // console.log(map_token)
    res.locals.mapToken = map_token
    res.locals.returnTo = req.session.returnTo;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/',(req,res)=>{
    res.render('home')
});
app.use('/camps/book',bookingRoute)
app.delete('/camps/rev/:id1/:id2',isAuthenticated,asyncWrap( async(req,res,next) =>{
    const {id1,id2} = req.params;
    console.log(id2)
    const camp = await campground.findById(id1)
    const rev = await review.findById(id2)
    const length = camp.reviews.length;
    const val = ((((camp.average*length) - rev.rating) /(length - 1)) || 0)
    await camp.updateOne({$pull: {reviews:id2},average:val})
    await rev.deleteOne();
    req.flash('success','Review successfully Deleted'); 
    res.redirect(`/camps/${id1}`);
    //isAuth
}))
app.use('/camps',campgroundRoute)
app.use((req,res,next)=>{
    next(new AppError("page not found",404))
});
app.use((err,req,res,next) => {
    console.log(err.name);
    const{status = 500,message = 'Something Went wrong'} = err
    res.status(status).render("errors",{err});
    // next()
})
app.listen(3000,()=>{
    fetcher();
    console.log('listening on port 3000')
});