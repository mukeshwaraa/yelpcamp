const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override'); 
const asyncWrap = require('./utils/asyncWrap'); 
const campValidator = require('./utils/campValidation');
const reviewValidator = require('./utils/reviewValidator');
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const flash = require('connect-flash')
const passport = require('passport');
const isAuthenticated = require('./utils/isAuth')
const isAuthorized = require('./utils/isAuthorized')
const LocalStrategy = require('passport-local');
// override with POST having ?_method=DELETE
// use ejs-locals for all ejs templates:
const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1/yelp-camp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log("database connected") });
const campground = require('./models/campgrounds');
const review = require('./models/reviews')
const user = require('./models/user');
const AppError = require('./utils/error');



const app =express();
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded());
app.use(methodOverride('_method'))
app.use(cookie_parser('secret'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }
  }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use((req,res,next) =>{
    console.dir(req.get('Referrer'));
    next();
})
app.get('/',(req,res)=>{
    res.render('home')
});


app.get('/camps',asyncWrap( async(req,res,next) =>{
    const campgrounds =await campground.find({})
    res.render('camps',{campgrounds})
}))
app.get('/camps/new',isAuthenticated,(req,res) =>{
    res.render('new') 
})
app.post('/camps/new',isAuthenticated,campValidator, asyncWrap(async(req,res,next) =>{
    const{campground:camp} = req.body;
    const camps = new campground({...camp});
    camps.author = req.user;
    await camps.save().then((doc) => {
    req.flash('success','New campground successfully created');    
    res.redirect(`/camps/${doc._id}`)}) 
}))
app.get('/camps/register',(req,res) =>{
    res.render('register');
})
app.get('/camps/login',(req,res) =>{
    res.render('login');
})
app.post('/camps/login',passport.authenticate('local',{ failureFlash:true, failureRedirect: '/camps/login' }) ,(req,res) =>{
    req.flash('success','Your account have been successfully logged-in');
    res.redirect('/camps')
})
app.post('/camps/register',asyncWrap(async(req,res,next) =>{
    try{
    const{username,password,email} = req.body.user
    const users = new user({username,email});
    const registeredUser = await user.register(users,password);
    console.log(registeredUser)
    req.login(registeredUser,(err) =>{
        if(err){
            return next(err)
        }else{                
    req.flash('success','Your account has been succesfully created');
            res.redirect('/camps')
        }
    }) }
    catch(e){
        console.log(e);
        req.flash('error',e.message);
        res.redirect('/camps/register')
    }
}))

app.get('/camps/logout',(req,res,next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/camps');
    });
})
app.get('/camps/:id',asyncWrap(async (req,res,next) =>{
    const {id} = req.params;

    const camp = await campground.findById(id).populate('reviews').populate('author');
    res.render('details',{camp})
}))
app.delete('/camps/:id',isAuthenticated,isAuthorized,asyncWrap( async(req,res,next) =>{
    await campground.findByIdAndDelete(req.params.id);
    req.flash('success','Campground successfully Deleted'); 
    res.redirect('/camps');
    //isAuth
}))
app.post('/camps/:id/review',isAuthenticated,reviewValidator,async(req,res,next) =>{
    const{review:revs} = req.body;
    const {id} = req.params;
    const camp = await campground.findById(id)
    if(!camp){
        req.flash('error','CAmpground not found');
        res.redirect('/camps')
    }
    const rev = new review({...revs});
    await rev.save();
    await camp.reviews.push(rev)
    await camp.save().then((doc) =>{
    req.flash('success','Review successfully created');  
    res.redirect(`/camps/${doc._id}`)})    
})
app.get('/camps/:id/edit',isAuthenticated,isAuthorized,asyncWrap(async(req,res,next) => {
    //isAuth
    const {id} = req.params;
    const camp = await campground.findById(id)

    res.render('edit',{camp})
}))
app.put('/camps/:id/edit',isAuthenticated,isAuthorized,asyncWrap(async(req,res,next) => {
    //isAuth
    const {id} = req.params;
    const{campground:camps} =req.body;
    const camp = await campground.findByIdAndUpdate(id,{...camps});
    camp.save().then((doc) => {
    req.flash('success','Campground changes has been successfully saved'); 
        res.redirect(`/camps/${doc._id}`);
    })
}))

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
    console.log('listening on port 3000')
});