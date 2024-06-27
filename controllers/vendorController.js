const user = require("../db/models/user");
const auth = require("./authController");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const viewVendorDetails = catchAsync(async (req, res, next) => {
  const vendorId = req.params.id;

  const existingVendor = await user.findByPk(vendorId);

  if (!existingVendor) {
    return next(new AppError("Invalid vendor id", 400));
  }

  if (Number(existingVendor.userType) !== 1) {
    return next(new AppError("User is not a vendor", 400));
  }
  res.status(201).json({
    status: "success",
    data: existingVendor,
  });
});

const listVendors = catchAsync(async (req, res, next) => {
  const vendors = await user.findAll({ where: { userType: "1" } });

  res.status(200).json({
    status: "success",
    data: vendors,
  });
});

module.exports = {
  viewVendorDetails,
  listVendors,
};
