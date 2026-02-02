const Joi = require("joi");

const createDriver = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  middle_name: Joi.string().max(100).allow(null, ""),
  date_of_birth: Joi.date().required(),
  address_region: Joi.string().max(100).required(),
  address_province: Joi.string().max(100).required(),
  address_city: Joi.string().max(100).required(),
  address_barangay: Joi.string().max(100).required(),
  address_street: Joi.string().max(255).required(),
  phone_number: Joi.string().max(20).required(),
  license_number: Joi.string().max(50).required(),
  license_expiration_date: Joi.date().required(),
  license_status: Joi.string()
    .valid("active", "expired", "suspended")
    .required(),
  vehicle_ownership: Joi.string().max(100).required(),
  vehicle_plate_number: Joi.string().max(50).required(),
});

const updateDriver = Joi.object({
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  middle_name: Joi.string().max(100).allow(null, ""),
  date_of_birth: Joi.date(),
  address_region: Joi.string().max(100),
  address_province: Joi.string().max(100),
  address_city: Joi.string().max(100),
  address_barangay: Joi.string().max(100),
  address_street: Joi.string().max(255),
  phone_number: Joi.string().max(20),
  license_number: Joi.string().max(50),
  license_expiration_date: Joi.date(),
  license_status: Joi.string().valid("active", "expired", "suspended"),
  vehicle_ownership: Joi.string().max(100),
  vehicle_plate_number: Joi.string().max(50),
});

module.exports = {
  createDriver,
  updateDriver,
};
