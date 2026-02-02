// Middleware function to validate request body against a Joi schema
const validate = (schema) => {
  return (req, res, next) => {
    // Validate the request body
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields from the validated data
    });

    if (error) {
      // Format error messages
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;

    next();
  };
};

module.exports = validate;
