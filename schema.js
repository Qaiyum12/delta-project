const Joi = require('joi');

module.exports.listingSchema = Joi.object({          // inside this we must have the listing object
    listing : Joi.object({                            // according to "Joi" this "listing" object should be required.
        title: Joi.string().required(),     
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),   // here we use "min(0)" for price should not be negative.
        image: Joi.string().allow("", null)
    }).required()      

});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});