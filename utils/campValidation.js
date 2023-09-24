const joi = require('joi')
const AppError = require('./error')
const campValidator = function (req, res, next) {
  const campgroundSchema = joi.object({
    campground: joi.object({
      name: joi.string().required(),
      location: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
    }).required(),
    deleteImages: joi.array()
  });
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
