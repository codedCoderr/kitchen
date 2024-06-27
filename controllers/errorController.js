const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  res.status(statusCode).json({
    status,
    message,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;
  if (error.isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Error",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid Token", 401);
  }
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
