const user = require("../dbs/models/user");
const bcrypt = require("bcrypt");
const responseService = require("../utils/response.service");
const auth = require("../utils/auth");

const signup = async (req) => {
  const body = req.body;
  if (![2].includes(body.userType)) {
    return responseService.error(
      "Only users with userType->2 are allowed to signup",
      responseService.statusCodes.badRequest
    );
  }
  const newUser = await user.create({
    ...body,
  });
  if (!newUser) {
    return responseService.error(
      "Failed to created a new user",
      responseService.statusCodes.badRequest
    );
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = auth.generateToken({ id: result.id });

  return responseService.success("Signup was successful", result.token);
};

const login = async (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responseService.error(
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
    return responseService.error(
      "Invalid login details",
      responseService.statusCodes.unauthorized
    );
  } else {
    const token = auth.generateToken({ id: existingUser.id });
    return responseService.success("Login was successful", token);
  }
};

module.exports = { signup, login };
