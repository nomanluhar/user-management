const joi = require("@hapi/joi");

function validateUser(user) {
    const joiSchema = joi.object({
        fullname: joi.string().required(),
        email: joi.string().email().lowercase().required(),
        password: joi.string().min(4).required(),
    }).options({ abortEarly: false });

    return joiSchema.validate(user)
}

function validateLoginUser(user) {
    const joiSchema = joi.object({
        email: joi.string().email().lowercase().required(),
        password: joi.string().min(4).required(),
    }).options({ abortEarly: false });

    return joiSchema.validate(user)
}


module.exports = {
    validateUser,validateLoginUser
}