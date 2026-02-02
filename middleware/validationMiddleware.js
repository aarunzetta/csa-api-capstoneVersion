const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const details = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: details,
        });
      }

      req.body = value;
      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "An error occurred during validation.",
      });
    }
  };
};

module.exports = { validateRequest };
