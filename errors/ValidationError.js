class ValidationError extends Error {
  constructor(err) {
    super(err.message);
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
