import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const loginSchema: Joi.Schema = Joi.object().keys({
    username: Joi.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});

export const signupSchema: Joi.Schema = Joi.object().keys({
    username: Joi.string().trim().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
});

export const roomName: Joi.Schema = Joi.object().keys({
    name: Joi.string().trim().regex(/(^[-a-zA-Z0-9_ ]*$)/).max(30).required()
});

export const taskSchema: Joi.Schema = Joi.object().keys({
    name: Joi.string().trim().required(),
    roomid: Joi.objectId().trim().required()
});