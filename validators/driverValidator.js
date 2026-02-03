const Joi = require("joi");

// Create driver validation schema
const createDriverSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),

  last_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
  }),

  middle_name: Joi.string().max(50).allow(null, "").optional(),

  date_of_birth: Joi.date().max("now").required().messages({
    "date.max": "Date of birth cannot be in the future",
    "any.required": "Date of birth is required",
  }),

  address_region: Joi.string().max(100).allow(null, "").optional(),

  address_province: Joi.string().max(100).allow(null, "").optional(),

  address_city: Joi.string().max(100).allow(null, "").optional(),

  address_barangay: Joi.string().max(100).allow(null, "").optional(),

  address_street: Joi.string().max(200).allow(null, "").optional(),

  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be 11 digits",
    }),

  license_number: Joi.string().min(5).max(50).required().messages({
    "string.empty": "License number is required",
    "any.required": "License number is required",
  }),

  license_expiration_date: Joi.date().min("now").required().messages({
    "date.min": "License expiration date must be in the future",
    "any.required": "License expiration date is required",
  }),

  license_status: Joi.string()
    .valid("active", "expired", "suspended", "revoked")
    .default("active")
    .messages({
      "any.only":
        "License status must be: active, expired, suspended, or revoked",
    }),

  vehicle_ownership: Joi.string()
    .valid("owned", "rented", "company", "other")
    .allow(null, "")
    .optional()
    .messages({
      "any.only": "Vehicle ownership must be: owned, rented, company, or other",
    }),

  vehicle_plate_number: Joi.string().max(20).allow(null, "").optional(),

  qr_code: Joi.string().max(255).allow(null, "").optional(),
});

// Update driver validation schema
const updateDriverSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  middle_name: Joi.string().max(50).allow(null, "").optional(),
  date_of_birth: Joi.date().max("now").optional(),
  address_region: Joi.string().max(100).allow(null, "").optional(),
  address_province: Joi.string().max(100).allow(null, "").optional(),
  address_city: Joi.string().max(100).allow(null, "").optional(),
  address_barangay: Joi.string().max(100).allow(null, "").optional(),
  address_street: Joi.string().max(200).allow(null, "").optional(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .allow(null, "")
    .optional(),
  license_number: Joi.string().min(5).max(50).optional(),
  license_expiration_date: Joi.date().min("now").optional(),
  license_status: Joi.string()
    .valid("active", "expired", "suspended", "revoked")
    .optional(),
  vehicle_ownership: Joi.string()
    .valid("owned", "rented", "company", "other")
    .allow(null, "")
    .optional(),
  vehicle_plate_number: Joi.string().max(20).allow(null, "").optional(),
  qr_code: Joi.string().max(255).allow(null, "").optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  createDriverSchema,
  updateDriverSchema,
};
