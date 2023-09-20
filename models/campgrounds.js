const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');
const User = require('./user');
const Booking = require('./bookings');
const campgroundschema = new Schema({
    name:{
        require:true,
        type:String
    },
    description:{
        require:true,
        type:String
    },
    location:{
        require:true,
        type:String
    },
    price:{
        require:true,
        type:Number
    },
    image:{
        require:true,
        type:String
    },
    
    average:{
        type:Number,
        require:true,
        default:0
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'    
    },
    bookings:[
        {
            type:Schema.Types.ObjectId,
            ref:'Booking'
        }
    ]
})

campgroundschema.pre('findOneAndDelete',async function(doc){
    console.log("from pre")
    console.log(doc);

})
campgroundschema.post('findOneAndDelete',async function(doc){
    console.log("from post")
    console.log(doc);
    console.log(doc._id);
    await Review.deleteMany(
        {
            _id:{
                $in:doc.reviews
            }
                    })

})

const campground = mongoose.model("Campground",campgroundschema);


module.exports = campground;