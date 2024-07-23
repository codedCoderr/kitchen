const menu = require("../dbs/models/menu");
const auth = require("../utils/auth");
const user = require("../dbs/models/user");
const responseService = require("../utils/response.service");
const AppError = require("../utils/appError");

const createMenu = async (req) => {
  const body = req.body;

  return menu.create({
    ...body,
    vendor: req.user.id,
  });
};

const updateMenu = async (req) => {
  const userId = req.user.id;

  const menuId = req.params.id;
  const body = req.body;

  const existingMenu = await menu.findByPk(menuId);
  if (!existingMenu) {
    throw new AppError("Invalid menu id", responseService.statusCodes.notFound);
  }

  if (Number(existingMenu.vendor) !== userId) {
    throw new AppError(
      "You can only update a menu you created as a vendor",
      responseService.statusCodes.badRequest
    );
  }

  const updatedMenu = await existingMenu.update({ ...body });

  return updatedMenu;
};

const deleteMenu = async (req) => {
  const userId = req.user.id;

  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    throw new AppError("Invalid menu id", responseService.statusCodes.notFound);
  }

  if (Number(existingMenu.vendor) !== userId) {
    throw new AppError(
      "You can only delete a menu you created as a vendor",
      responseService.statusCodes.forbidden
    );
  }

  await existingMenu.destroy();
};

const viewMenuDetails = async (req) => {
  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    throw new AppError("Invalid menu id", responseService.statusCodes.notFound);
  }
  return existingMenu;
};

const listMenu = async (req) => {
  let menus;
  const isCustomer = auth.checkIsCustomer(req.user);

  if (isCustomer) {
    if (!req.query?.vendor) {
      throw new AppError(
        "Vendor id is required",
        responseService.statusCodes.badRequest
      );
    }
    const vendor = await user.findByPk(req.query.vendor);
    if (!vendor) {
      throw new AppError(
        "Invalid vendor id",
        responseService.statusCodes.notFound
      );
    }
    const isVendorACustomer = auth.checkIsCustomer(vendor);

    if (isVendorACustomer) {
      throw new AppError(
        "ID provided is not a vendor id",
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

  return menus;
};

module.exports = {
  createMenu,
  listMenu,
  updateMenu,
  deleteMenu,
  viewMenuDetails,
};
