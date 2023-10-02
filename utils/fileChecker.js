const joi = require('joi')
const AppError = require('./error')
const {campgroundSchema} = require('./schemas.js')
const maxSize = 10485760;
const fileCheckers = async function(req,file,cb){
    // console.log(req.headers['content-length']);

    // console.log('ha')
    if(!req.isAuthenticated()){
        return cb(new Error('you need to be logged in'))
    }else{
        // return cb(null,true)
        const { error } = campgroundSchema.validate(req.body);
        if (error) {            
          const msg = error.details.map((er) => er.message).join(',')
          return cb(new AppError(msg,400))
        }
        else {
            fileSize = (req.headers['content-length']);
               // console.log('ha')
                if(fileSize > maxSize){
                return cb(new Error('Maximun 10mb only allowed'))
        }
    }
    }

    return cb(null,true)
}


module.exports = fileCheckers;