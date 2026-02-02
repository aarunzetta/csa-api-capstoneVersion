const Joi = require("joi");

const createAdmin = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().max(20).allow(null, ""),
  password: Joi.string().min(6).max(255).required(),
  role: Joi.string()
    .valid("super_admin", "admin", "moderator")
    .default("admin"),
  is_active: Joi.number().valid(0, 1).default(1),
});

const updateAdmin = Joi.object({
  username: Joi.string().alphanum().min(3).max(50),
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  email: Joi.string().email(),
  phone_number: Joi.string().max(20).allow(null, ""),
  password: Joi.string().min(6).max(255),
  role: Joi.string().valid("super_admin", "admin", "moderator"),
  is_active: Joi.number().valid(0, 1),
});

module.exports = {
  createAdmin,
  updateAdmin,
};
