const menu = require("../dbs/models/menu");
const auth = require("../utils/auth");
const user = require("../dbs/models/user");
const responseService = require("../utils/response.service");

const createMenu = async (req) => {
  const body = req.body;

  const newMenu = await menu.create({
    ...body,
    vendor: req.user.id,
  });

  if (!newMenu) {
    return responseService.error(
      "Failed to created a new menu",
      responseService.statusCodes.badRequest
    );
  }
  return responseService.success("Menu created successfully", newMenu);
};

const updateMenu = async (req) => {
  const userId = req.user.id;

  const menuId = req.params.id;
  const body = req.body;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return responseService.error(
      "Invalid menu id",
      responseService.statusCodes.notFound
    );
  }

  if (Number(existingMenu.vendor) !== userId) {
    return responseService.error(
      "You can only update a menu you created as a vendor",
      responseService.statusCodes.badRequest
    );
  }

  const updatedMenu = await existingMenu.update({ ...body });

  return responseService.error("Menu updated successfully", updatedMenu);
};

const deleteMenu = async (req) => {
  const userId = req.user.id;

  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return responseService.error(
      "Invalid menu id",
      responseService.statusCodes.notFound
    );
  }

  if (Number(existingMenu.vendor) !== userId) {
    return responseService.error(
      "You can only delete a menu you created as a vendor",
      responseService.statusCodes.forbidden
    );
  }

  await existingMenu.destroy();
  return responseService.success("Record deleted successfully");
};

const viewMenuDetails = async (req) => {
  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return responseService.error(
      "Invalid menu id",
      responseService.statusCodes.notFound
    );
  }
  return responseService.error(
    "Menu details fetched successfully",
    existingMenu
  );
};

const listMenu = async (req) => {
  let menus;
  const isCustomer = auth.checkIsCustomer(req.user);

  if (isCustomer) {
    if (!req.query?.vendor) {
      return responseService.error(
        "Vendor id is required",
        responseService.statusCodes.badRequest
      );
    }
    const vendor = await user.findByPk(req.query.vendor);
    if (!vendor) {
      return responseService.error(
        "Invalid vendor id provided",
        responseService.statusCodes.notFound
      );
    }
    const isVendorACustomer = auth.checkIsCustomer(vendor);

    if (isVendorACustomer) {
      return responseService.error(
        "id provided is not a vendor",
        responseService.statusCodes.notFound
      );
    } else {
      menus = await menu.findAll({ where: { vendor: req.query.vendor } });
    }
  } else {
    menus = await menu.findAll({
      where: {
        vendor: req.user.id,
      },
    });
  }

  return responseService.success("Vendor's menus fetched successfully", menus);
};

module.exports = {
  createMenu,
  listMenu,
  updateMenu,
  deleteMenu,
  viewMenuDetails,
};
