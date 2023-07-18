class NotFoundError extends Error {
  constructor(message) {
    const defaultMessage = 'Несуществующий id';
    super(message || defaultMessage);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
