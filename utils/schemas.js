const baseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')
const extension = (joi) =>({
    type:'string',
    base:joi.string(),
    messages:{
            'string.escapeHTML': '{{#label}} must not include HTML'},
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                })  
                if(clean !== value) return helpers.error('string.escapeHTML',{value})
                return clean;

            }
        }
    }
})
const joi = baseJoi.extend(extension)
const reviewSchema = joi.object({
    review: joi.object({
      review: joi.string().required().escapeHTML(),
      rating: joi.number().required().min(1),
    }).required()
  })

  const campgroundSchema = joi.object({
    campground: joi.object({
      name: joi.string().required().escapeHTML(),
      location: joi.string().required().escapeHTML(),
      description: joi.string().required().escapeHTML(),
      price: joi.number().required().min(0),
    }).required(),
    deleteImages: joi.array()
  })

  const bookingSchema = joi.object({
    booking: joi.object({
      from: joi.date().greater('now').required(),
      to: joi.date().greater(joi.ref('from')).required()
    }).required()
  })


  module.exports = {
    reviewSchema,
    campgroundSchema,
    bookingSchema
  }