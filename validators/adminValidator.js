const Joi = require("joi");

// Create admin validation schema
const createAdminSchema = Joi.object({
  username: Joi.string().min(3).max(50).alphanum().required().messages({
    "string.empty": "Username is required",
    "string.alphanum": "Username must contain only letters and numbers",
  }),

  first_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
  }),

  last_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be 11 digits",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid("super_admin", "admin", "moderator")
    .default("admin")
    .messages({
      "any.only": "Role must be: super_admin, admin, or moderator",
    }),

  is_active: Joi.number().integer().valid(0, 1).default(1).messages({
    "any.only": "is_active must be 0 or 1",
  }),
});

// Update admin validation schema
const updateAdminSchema = Joi.object({
  username: Joi.string().min(3).max(50).alphanum().optional(),
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("super_admin", "admin", "moderator").optional(),
  is_active: Joi.number().integer().valid(0, 1).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  createAdminSchema,
  updateAdminSchema,
};
