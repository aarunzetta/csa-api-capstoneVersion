const Joi = require("joi");

// Create passenger validation schema
const createPassengerSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),

  last_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),

  middle_name: Joi.string().max(50).allow(null, "").optional(),

  date_of_birth: Joi.date().max("now").required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.max": "Date of birth cannot be in the future",
    "any.required": "Date of birth is required",
  }),

  username: Joi.string().min(3).max(50).alphanum().required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot exceed 50 characters",
    "string.alphanum": "Username must contain only letters and numbers",
  }),

  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base":
        "Phone number must be 11 digits (e.g., 09171234567)",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

// Update passenger validation schema (all fields optional except those being updated)
const updatePassengerSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),

  last_name: Joi.string().min(2).max(50).optional(),

  middle_name: Joi.string().max(50).allow(null, "").optional(),

  date_of_birth: Joi.date().max("now").optional(),

  username: Joi.string().min(3).max(50).alphanum().optional(),

  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional(),

  email: Joi.string().email().optional(),

  password: Joi.string().min(6).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  createPassengerSchema,
  updatePassengerSchema,
};
