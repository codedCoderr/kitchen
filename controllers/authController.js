const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const signup = catchAsync(async (req, res) => {
  const response = await authService.signup(req);
  if (response.success) {
    res.status(response.status).json({
      message: response.message,
      token: response.data,
    });
  }
  res.status(response.error).json({
    message: response.message,
  });
});

const login = catchAsync(async (req, res) => {
  const response = await authService.login(req);
  if (response.success) {
    res.status(response.status).json({
      message: response.message,
      token: response.data,
    });
  }
  res.status(response.error).json({
    message: response.message,
  });
});

module.exports = { signup, login };
