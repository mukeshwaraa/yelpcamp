const joi = require('joi')
const AppError = require('./error')
const {campgroundSchema} = require('./schemas.js')
const campValidator = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (!error) {
    return next()
  }
  else {
    const msg = error.details.map((er) => er.message).join(',')
    next(new AppError(msg,400))
  }
}
module.exports = campValidator;
