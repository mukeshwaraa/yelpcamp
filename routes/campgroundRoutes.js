const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap'); 
const campValidator = require('../utils/campValidation');
const reviewValidator = require('../utils/reviewValidator');
const flash = require('connect-flash')
const passport = require('passport');
const isAuthenticated = require('../utils/isAuth')
const {isAuthorized} = require('../utils/isAuthorized')
const getAddress = require('../utils/getAddres')
const cupload = require('../utils/cUplaod')
const campground = require('../models/campgrounds');
const review = require('../models/reviews')
const user = require('../models/user');

router.get('/',asyncWrap( async(req,res,next) =>{
    // console.log("from main camp route")
    const campgrounds =await campground.find({})
    res.render('camps',{campgrounds})
}))

router.get('/new',(req,res) =>{
    //isAuthenticated
    let camp = {name:"",price:"",description:"",location:{city:"",state:"",country:""}};
        if(req?.cookies?.formData?.campground || req?.cookies?.formData?.address){
            // console.log(req.cookies.formData.campground)
            ca = {name:"",price:"",description:""}
            loc={city:"",state:"",country:""}
            if(req.cookies.formData.campground){
            const{name = "",price = 0,description = ""} = req.cookies.formData.campground
            ca = {name,price,description}}
            // else{ca = {name:"",price:"",description:""}}
            if(req.cookies.formData.address){
                const{city = "",state = "",country = ""} = req.cookies.formData.address
                loc={city,state,country};}
            // else{loc={city:"",state:"",country:""}}
                
                camp={...ca,location:loc}

    }
    // else{camp ={name:"",price:"",description:"",location:{city:"",state:"",country:""}}}

        res.render('new',{camp}); 
})
router.post('/new',cupload,isAuthenticated,campValidator,asyncWrap(async(req,res,next) =>{
    // isAuthenticated,
    const{campground:camp,address:addss} = req.body;
    const coo = await getAddress(addss);
    const adds = {...addss,...coo};
    const camps = new campground({...camp,average:0});
    camps.images = req.files.map(f => ({ path:f.path,filename: f.filename}))
    camps.location = adds
    camps.author = req.user;
    await camps.save().then((doc) => {
    req.flash('success','New campground successfully created'); 
    res.clearCookie('formData');   
    res.redirect(`/camps/${doc._id}`)}) 
}))
router.get('/register',(req,res) =>{
    if(req.get('Referrer') && req.get('Referrer') !== (('http://localhost:3000/camps/register') && ('http://localhost:3000/camps/login')) ){
   req.session.returnTo = req.get('Referrer') 
    }
    res.render('register');
})

router.post('/register',asyncWrap(async(req,res,next) =>{
    try{
    // console.log(res.locals.returnTdoco)    
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
router.get('/login',(req,res) =>{
    if(req.get('Referrer') && req.get('Referrer') !== (('http://localhost:3000/camps/register') && ('http://localhost:3000/camps/login'))){
   req.session.returnTo = req.get('Referrer')}
    res.render('login');
})
router.post('/login',passport.authenticate('local',{ failureFlash:true, failureRedirect: '/camps/login' }) ,(req,res) =>{
    console.log(res.locals.returnTo)   
    const redirectURL = res.locals.returnTo || '/camps';
    req.flash('success','Your account have been successfully logged-in');
    res.redirect(redirectURL)
})


router.get('/logout',(req,res,next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.clearCookie('formData'); 
        req.flash('success', 'Goodbye!');
        res.redirect('/camps');
    });
})
router.get('/showBooks',asyncWrap( async(req,res,next) =>{
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
router.get('/:id',asyncWrap(async (req,res,next) =>{
    let revs
    const {id} = req.params;
    if(req.cookies?.formData?.review){
        console.log(req.cookies.formData.review)
        let{review:r=""} =  req.cookies.formData.review;
        revs = {review:r}
    }

    const camp = await campground.findById(id).populate({path:
        'reviews',
    populate:{  
        path:'author'
    }}).populate('author');
    res.render('details',{camp,revs})
}))
router.delete('/:id',isAuthenticated,isAuthorized,asyncWrap( async(req,res,next) =>{
    await campground.findByIdAndDelete(req.params.id);
    req.flash('success','Campground successfully Deleted'); 
    res.redirect('/camps');
    //isAuth
}))
router.get('/:id/edit',isAuthenticated,isAuthorized,asyncWrap(async(req,res,next) => {
    //isAuth
    const {id} = req.params;
    const camp = await campground.findById(id)

    res.render('edit',{camp})
}))
router.put('/:id/edit',isAuthenticated,isAuthorized,cupload,campValidator,asyncWrap(async(req,res,next) => {
    //isAuth

    const {id} = req.params;
    const{campground:camps,address:addss} = req.body;
    const coo = await getAddress(addss);
    const adds = {...addss,...coo};
    const camp = await campground.findByIdAndUpdate(id,{...camps,location:adds});
    imgs = req.files.map(f => ({ path:f.path,filename: f.filename}))
    if(req.body.deleteImages){
        console.log(req.body.deleteImages)
        for(imggg of req.body.deleteImages){
            cloudinary.uploader.destroy(imggg);
        }
        await camp.updateOne({$pull : {images:{filename:{$in: [...req.body.deleteImages]}}}})
    }
    // await campground.findByIdAndUpdate(id1,{$pull: {reviews:id2}})
    camp.images.push(...imgs)
    // camp.images.$pull
    camp.location = adds
    camp.save().then((doc) => {
    req.flash('success','Campground changes has been successfully saved'); 
        res.redirect(`/camps/${doc._id}`);
    })
}))
router.post('/:id/review',isAuthenticated,reviewValidator,async(req,res,next) =>{
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
    // console.log(val)
    camp.average = val / ((camp.reviews.length)); 
    res.clearCookie('formData'); 
    await camp.save().then((doc) =>{
    req.flash('success','Review successfully created'); 
    // console.log(camp.average);
    // console.log(camp.reviews.length);
    res.redirect(`/camps/${doc._id}`)})    
})

module.exports =router;

