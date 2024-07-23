const user = require("../dbs/models/user");
const responseService = require("../utils/response.service");
const AppError = require("../utils/appError");

const viewVendorDetails = async (req) => {
  const vendorId = req.params.id;

  const existingVendor = await user.findByPk(vendorId);

  if (!existingVendor) {
    throw new AppError(
      "Invalid vendor id",
      responseService.statusCodes.notFound
    );
  }

  if (Number(existingVendor.userType) !== 1) {
    throw new AppError(
      "ID provided is not a vendor id",
      responseService.statusCodes.notFound
    );
  }
  return existingVendor;
};

const listVendors = async (req) => {
  return user.findAll({ where: { userType: "1" } });
};

module.exports = {
  viewVendorDetails,
  listVendors,
};
