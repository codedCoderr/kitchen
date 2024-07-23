const catchAsync = require("./catchAsync");
const jwt = require("jsonwebtoken");
const user = require("../dbs/models/user");
const AppError = require("./appError");

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (req.headers.authorization) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    throw new AppError("Please login to get access");
  }
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const existingUser = await user.findByPk(tokenDetail.id);

  if (!existingUser) {
    throw new AppError("Invalid credentials");
  }
  req.user = existingUser;
  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      throw new AppError(
        "You don't have permission to perform this action",
        403
      );
    }
    return next();
  };
  return checkPermission;
};

const checkIsCustomer = (user) => {
  if (Number(user.userType) === 2) {
    return true;
  }
  return false;
};

const generateToken = (payload) => {
  const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { authentication, restrictTo, checkIsCustomer, generateToken };
