const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const stack = error.stack;

  res.status(statusCode).json({
    error: message,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const stack = error.stack;
  if (error.isOperational) {
    res.status(statusCode).json({
      error: message,
    });
  }
  return res.status(500).json({
    error: "Internal Error",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError("Email must be unique", 400);
  }

  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid Token", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new AppError("Token has expired", 401);
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
