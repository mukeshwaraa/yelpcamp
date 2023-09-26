const joi = require('joi')
const AppError = require('./error')
const {bookingSchema} = require('./schemas.js')
const bookingValidator = function (req, res, next) {
  const { error } = bookingSchema.validate(req.body);
  if (!error) {
    return next()
  }
  else {
    const msg = error.details.map((er) => er.message).join(',')
    next(new AppError(msg,400))
  }
}
module.exports = bookingValidator;