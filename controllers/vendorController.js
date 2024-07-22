const catchAsync = require("../utils/catchAsync");
const vendorService = require("../services/vendorService");

const viewVendorDetails = catchAsync(async (req, res) => {
  const response = await vendorService.viewVendorDetails(req);
  if (response.success) {
    res.status(response.status).json({
      message: response.message,
      data: response.data,
    });
  }
  res.status(response.error).json({
    message: response.message,
  });
});

const listVendors = catchAsync(async (req, res) => {
  const response = await vendorService.listVendors(req);
  if (response.success) {
    res.status(response.status).json({
      message: response.message,
      data: response.data,
    });
  }
  res.status(response.error).json({
    message: response.message,
  });
});

module.exports = {
  viewVendorDetails,
  listVendors,
};
