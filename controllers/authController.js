const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  if (![2].includes(body.userType)) {
    return next(
      new AppError("Only users with userType->2 are allowed to signup", 400)
    );
  }
  const newUser = await user.create({
    ...body,
  });
  if (!newUser) {
    return next(new AppError("Failed to created a new user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Incomplete input", 400));
  }
  const existingUser = await user.findOne({
    where: { email },
  });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return next(new AppError("Invalid login details", 401));
  }
  const token = generateToken({ id: existingUser.id });

  res.status(201).json({
    status: "success",
    token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (req.headers.authorization) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError("Please login to get access", 400));
  }
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const existingUser = await user.findByPk(tokenDetail.id);

  if (!existingUser) {
    return next(new AppError("Invalid credentials", 400));
  }
  req.user = existingUser;
  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

const checkIsCustomer = (user) => {
  console.log(user.userType);
  if (Number(user.userType) === 2) {
    return true;
  }
  return false;
};
module.exports = { signup, login, authentication, restrictTo, checkIsCustomer };
