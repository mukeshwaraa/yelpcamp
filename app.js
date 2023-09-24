if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override'); 
const asyncWrap = require('./utils/asyncWrap'); 
const campValidator = require('./utils/campValidation');
const reviewValidator = require('./utils/reviewValidator');
const bookingValidator = require('./utils/bookingValidator')
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const flash = require('connect-flash')
const passport = require('passport');
const isAuthenticated = require('./utils/isAuth')
const isAuthorized = require('./utils/isAuthorized')
const LocalStrategy = require('passport-local');
const multer = require('multer');
const {storage,cloudinary} = require('./cloudinary/index')
const upload = multer({storage})
// import {v2 as cloudinary} from 'cloudinary';
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
const booking = require('./models/bookings')
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
    // console.log(req.originalUrl)
    // console.log(req.get('Referrer'))
    // // console.log(req.get('Referrer') && req.get('Referrer') !== 'http://localhost:3000/camps/login')
    res.locals.returnTo = req.session.returnTo;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
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
    //isAuthenticated
    let camp;
        if(req.cookies.formData && req.cookies.formData.campground){
        const{name = "",location = "",price = 0,description = ""} = req.cookies.formData.campground
        camp = {
            name,location,image,price,description
        }}else
        {
        camp ={name:"",location:"",price:"",description:""}    
}
        res.render('new',{camp}); 
})
app.post('/camps/new',isAuthenticated,upload.array('image'),campValidator,asyncWrap(async(req,res,next) =>{
    console.log("hai")
    const{campground:camp} = req.body;
    const camps = new campground({...camp,average:0});
    camps.images = req.files.map(f => ({ path:f.path,filename: f.filename}))
    camps.author = req.user;
    await camps.save().then((doc) => {
    req.flash('success','New campground successfully created'); 
    res.clearCookie('formData');   
    res.redirect(`/camps/${doc._id}`)}) 
}))
app.get('/camps/register',(req,res) =>{
    if(req.get('Referrer') && req.get('Referrer') !== (('http://localhost:3000/camps/register') && ('http://localhost:3000/camps/login')) ){
   req.session.returnTo = req.get('Referrer') 
    }
    res.render('register');
})

app.post('/camps/register',asyncWrap(async(req,res,next) =>{
    try{
    console.log(res.locals.returnTdoco)    
    const redirectURL = res.locals.returnTo || '/camps';
    const{username,password,email} = req.body.user
    const users = new user({username,email});
    const registeredUser = await user.register(users,password);
    req.login(registeredUser,(err) =>{
        if(err){
            return next(err)
        }else{                
    req.flash('success','Your account has been succesfully created');
            res.redirect(redirectURL);  
        }
    }) }
    catch(e){
        console.log(e);
        req.flash('error',e.message);
        res.redirect('/camps/register')
    }
}))
app.get('/camps/login',(req,res) =>{
    if(req.get('Referrer') && req.get('Referrer') !== (('http://localhost:3000/camps/register') && ('http://localhost:3000/camps/login'))){
   req.session.returnTo = req.get('Referrer')}
    res.render('login');
})
app.post('/camps/login',passport.authenticate('local',{ failureFlash:true, failureRedirect: '/camps/login' }) ,(req,res) =>{
    console.log(res.locals.returnTo)   
    const redirectURL = res.locals.returnTo || '/camps';
    req.flash('success','Your account have been successfully logged-in');
    res.redirect(redirectURL)
})


app.get('/camps/logout',(req,res,next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.clearCookie('formData'); 
        req.flash('success', 'Goodbye!');
        res.redirect('/camps');
    });
})
app.get('/camps/showBooks',asyncWrap( async(req,res,next) =>{
    if(!req.user){
        console.log(req.user);
        req.flash('error','You need to be looged in to see your bookings')
        return res.redirect('/camps/login');
    }else{
        const {id} = req.user;
        const users =await user.findById(id).populate({
            path:'bookings',
            populate:{
                path:'camp'
            }
    })  
        res.render('bookinglist',{users})
    }
}))
app.get('/camps/book/:id',asyncWrap( async(req,res,next) =>{
    const {id} = req.params;
    const camp = await campground.findById(id);
   res.render('booking',{camp})
}))
app.post('/camps/book/:id',isAuthenticated,bookingValidator,asyncWrap( async(req,res,next) =>{
    const {booking:books} = req.body;
    const{id} = req.params;
    const {id:id1} = req.user;
    console.log(id1);
    const users = await user.findById(id1);
    const ca = await campground.findById(id);
    const book = new booking({...books});
    book.camp = id;
    await book.save().then(async(doc) =>{
        req.flash('success','Booking successfully created')
        ca.bookings.push(book);
        await ca.save();
        users.bookings.push(book);
        await users.save();
        res.redirect('/camps')
    });

}))
app.get('/camps/:id',asyncWrap(async (req,res,next) =>{
    const {id} = req.params;
    const camp = await campground.findById(id).populate({path:
        'reviews',
    populate:{  
        path:'author'
    }}).populate('author');
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
    rev.author = req.user;
    await rev.save();
    await camp.reviews.push(rev)
    const val = (camp.average * ((camp.reviews.length )- 1)) + rev.rating;
    console.log(val)
    camp.average = val / ((camp.reviews.length)); 
    await camp.save().then((doc) =>{
    req.flash('success','Review successfully created'); 
    console.log(camp.average);
    console.log(camp.reviews.length);
    res.redirect(`/camps/${doc._id}`)})    
})
app.get('/camps/:id/edit',isAuthenticated,isAuthorized,asyncWrap(async(req,res,next) => {
    //isAuth
    const {id} = req.params;
    const camp = await campground.findById(id)

    res.render('edit',{camp})
}))
app.put('/camps/:id/edit',isAuthenticated,isAuthorized,upload.array('image'),asyncWrap(async(req,res,next) => {
    //isAuth
    const {id} = req.params;
    const{campground:camps} =req.body;
    const camp = await campground.findByIdAndUpdate(id,{...camps});
    imgs = req.files.map(f => ({ path:f.path,filename: f.filename}))
    if(req.body.deleteImages){
        for(imggg of req.body.deleteImages){
            cloudinary.uploader.destroy(imggg);
        }
        await camp.updateOne({$pull : {images:{filename:{$in: [...req.body.deleteImages]}}}})
    }
    // await campground.findByIdAndUpdate(id1,{$pull: {reviews:id2}})
    camp.images.push(...imgs)
    camp.images.$pull
    camp.save().then((doc) => {
    req.flash('success','Campground changes has been successfully saved'); 
        res.redirect(`/camps/${doc._id}`);
    })
}))
app.delete('/camps/rev/:id1/:id2',isAuthenticated,asyncWrap( async(req,res,next) =>{
    const {id1,id2} = req.params;
    console.log(id2)
    await campground.findByIdAndUpdate(id1,{$pull: {reviews:id2}})
    await review.findByIdAndDelete(id2);
    req.flash('success','Review successfully Deleted'); 
    res.redirect(`/camps/${id1}`);
    //isAuth
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