const catchAsync = require("../utils/catchAsync");
const vendorService = require("../services/vendorService");
const responseService = require("../utils/response.service");

const viewVendorDetails = catchAsync(async (req, res, next) => {
  try {
    const response = await vendorService.viewVendorDetails(req);

    responseService.success(
      res,
      "Vendor detail fetched successfully",
      responseService.statusCodes.ok,
      response
    );
  } catch (error) {
    next(error);
  }
});

const listVendors = catchAsync(async (req, res, next) => {
  try {
    const response = await vendorService.listVendors(req);

    responseService.success(
      res,
      "Vendors fetched successfully",
      responseService.statusCodes.ok,
      response
    );
  } catch (error) {
    next(error);
  }
});

module.exports = {
  viewVendorDetails,
  listVendors,
};
