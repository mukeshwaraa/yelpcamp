const joi = require('joi')
const AppError = require('./error')
const bookingValidator = function (req, res, next) {
  const bookingSchema = joi.object({
    booking: joi.object({
      from: joi.date().greater('now').required(),
      to: joi.date().greater(joi.ref('from')).required()
    }).required()
  })
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