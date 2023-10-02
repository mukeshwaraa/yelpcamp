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
      review: joi.string().trim().required().escapeHTML(),
      rating: joi.number().required().min(1),
    }).required()
  })

  const campgroundSchema = joi.object({
    campground: joi.object({
      name: joi.string().trim().required().escapeHTML(),
      description: joi.string().trim().required().escapeHTML(),
      price: joi.number().required().min(0),
    }).required(),
    deleteImages: joi.array(),
    address:joi.object({
      city: joi.string().trim().required().escapeHTML(),
      state: joi.string().trim().required().escapeHTML(),
      country: joi.string().trim().required().escapeHTML()
    }).required()
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