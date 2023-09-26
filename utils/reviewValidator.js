const joi = require('joi');
const AppError = require('./error')
const {reviewSchema} = require('./schemas.js')
const reviewValidator = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (!error) {
    return next()
  }
  else {
    const msg = error.details.map((er) => er.message).join(',')
    next(new AppError(msg,400))
  }
}
module.exports = reviewValidator;
