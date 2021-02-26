import Joi from 'joi';

const schema: Joi.Schema = Joi.object().keys({
    username: Joi.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});

export default schema;