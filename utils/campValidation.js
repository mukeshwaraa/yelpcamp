const joi = require('joi')
const AppError = require('./error')
const {campgroundSchema} = require('./schemas.js')
const campValidators = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (!error) {
    return next()
  }
  else {
    const msg = error.details.map((er) => er.message).join(',')
    next(new AppError(msg,400))
  }
}
const campValidator = function (req,file,cb) {
  const { error } = campgroundSchema.validate(req.body);
  if (!error) {
    return cb(null,true)
  }
  else {
    const msg = error.details.map((er) => er.message).join(',')
    return cb(new AppError(msg,400))
  }
}
module.exports ={ 
  campValidator,
  campValidators}
