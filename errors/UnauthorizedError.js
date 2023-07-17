class UnauthorizedError extends Error {
  constructor(message) {
    const defaultMessage = 'Необходима авторизация';
    super(message || defaultMessage);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
