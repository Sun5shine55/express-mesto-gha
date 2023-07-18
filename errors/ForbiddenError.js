class ForbiddenError extends Error {
  constructor(message) {
    const defaultMessage = 'Нет прав на удаление этой карточки';
    super(message || defaultMessage);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
