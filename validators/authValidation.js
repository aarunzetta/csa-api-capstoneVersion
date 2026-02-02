const Joi = require("joi");

const login = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).max(255).required(),
});

const getMe = Joi.object({});

module.exports = {
  login,
  getMe,
};
