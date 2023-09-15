const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');
const User = require('./user');

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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:Review
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    }
})

const campground = mongoose.model("Campground",campgroundschema);


module.exports = campground;