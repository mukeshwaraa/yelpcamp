const joi = require('joi');
const AppError = require('./error')
const reviewValidator = function (req, res, next) {
  const reviewSchema = joi.object({
    review: joi.object({
      review: joi.string().required(),
      rating: joi.number().required().min(1),
    }).required()
  })
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
