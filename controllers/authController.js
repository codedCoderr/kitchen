const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const responseService = require("../utils/response.service");

const signup = catchAsync(async (req, res, next) => {
  try {
    const response = await authService.signup(req);

    responseService.success(
      res,
      "Signup was successful",
      responseService.statusCodes.created,
      response,
      "auth"
    );
  } catch (error) {
    next(error);
  }
});

const login = catchAsync(async (req, res, next) => {
  try {
    const response = await authService.login(req);

    responseService.success(
      res,
      "Login was successful",
      responseService.statusCodes.ok,
      response,
      "auth"
    );
  } catch (error) {
    next(error);
  }
});

module.exports = { signup, login };
