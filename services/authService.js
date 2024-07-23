const user = require("../dbs/models/user");
const bcrypt = require("bcrypt");
const responseService = require("../utils/response.service");
const auth = require("../utils/auth");
const AppError = require("../utils/appError");

const signup = async (req) => {
  const body = req.body;
  if (![2].includes(body.userType)) {
    throw new AppError(
      "Only users with userType -> 2 are allowed to signup",
      responseService.statusCodes.badRequest
    );
  }
  const newUser = await user.create({
    ...body,
  });

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = auth.generateToken({ id: result.id });

  return result.token;
};

const login = async (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(
      "Incomplete input",
      responseService.statusCodes.badRequest
    );
  }
  const existingUser = await user.findOne({
    where: { email },
  });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    throw new AppError(
      "Invalid login details",
      responseService.statusCodes.unauthorized
    );
  } else {
    return auth.generateToken({ id: existingUser.id });
  }
};

module.exports = { signup, login };
