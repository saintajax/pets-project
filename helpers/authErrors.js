class MyApiError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class VerificationError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}
class ValidationError extends MyApiError {
  constructor(message, errors) {
    super(message);
    this.status = 400;
    this.errors = errors;
  }
}

class NotAutorizedError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class RegistrationConflictError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  RegistrationConflictError,
  VerificationError,
  NotAutorizedError,
  ValidationError,
};
