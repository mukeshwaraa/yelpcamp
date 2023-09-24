const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');
const User = require('./user');
const Booking = require('./bookings');

const ImageSchema = new Schema(
    {
        path:{       
            require:true,
            type:String
     },
        filename:{       
            require:true,
            type:String
     }
    });

    ImageSchema.virtual('thumbnailURL').get(function(){
        return this.path.replace('/upload','/upload/t_media_lib_thumb')
    }) 
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
    images:[ImageSchema],
    
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