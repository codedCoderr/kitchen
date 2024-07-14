const user = require("../dbs/models/user");
const responseService = require("../utils/response.service");

const viewVendorDetails = async (req) => {
  const vendorId = req.params.id;

  const existingVendor = await user.findByPk(vendorId);

  if (!existingVendor) {
    return responseService.error(
      "Invalid vendor id",
      responseService.statusCodes.notFound
    );
  }

  if (Number(existingVendor.userType) !== 1) {
    return responseService.error(
      "User is not a vendor",
      responseService.statusCodes.notFound
    );
  }
  return responseService.success(
    "Vendor detail was fetched successfully",
    existingVendor
  );
};

const listVendors = async (req) => {
  const vendors = await user.findAll({ where: { userType: "1" } });

  return responseService.success("Vendors fetched successfully", vendors);
};

module.exports = {
  viewVendorDetails,
  listVendors,
};
