const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override'); 
const asyncWrap = require('./utils/asyncWrap'); 
const campValidator = require('./utils/campValidation');
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
const AppError = require('./utils/error');



const app =express();
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded());
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    res.render('home')
});


app.get('/camps',asyncWrap( async(req,res,next) =>{
    const campgrounds =await campground.find({})
    res.render('camps',{campgrounds})
}))
app.get('/camps/new',(req,res) =>{
    res.render('new') 
})
app.post('/camps/new',campValidator, asyncWrap(async(req,res,next) =>{
    const{campground:camp} = req.body;
    console.log
    const camps = new campground({...camp});
    await camps.save().then((doc) => 
    res.redirect(`/camps/${doc._id}`)) 
}))
app.get('/camps/:id',asyncWrap(async (req,res,next) =>{
    const {id} = req.params;
    const camp = await campground.findById(id)
    res.render('details',{camp})
}))
app.delete('/camps/:id',asyncWrap( async(req,res,next) =>{
    await campground.findByIdAndDelete(req.params.id);
    res.redirect('/camps');
}))
app.get('/camps/:id/edit',asyncWrap(async(req,res,next) => {
    const {id} = req.params;
    const camp = await campground.findById(id)
    res.render('edit',{camp})   
}))
app.put('/camps/:id/edit',asyncWrap(async(req,res,next) => {
    const {id} = req.params;
    const{campground:camps} =req.body;
    const camp = await campground.findByIdAndUpdate(id,{...camps});
    camp.save().then((doc) => {
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