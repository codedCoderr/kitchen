const menu = require("../db/models/menu");
const auth = require("./authController");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const user = require("../db/models/user");

const createMenu = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newMenu = await menu.create({
    ...body,
    vendor: req.user.id,
  });

  if (!newMenu) {
    return next(new AppError("Failed to created a new menu", 400));
  }

  res.status(201).json({
    status: "success",
    data: newMenu,
  });
});

const updateMenu = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const menuId = req.params.id;
  const body = req.body;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return next(new AppError("Invalid menu id", 400));
  }

  if (Number(existingMenu.vendor) !== userId) {
    return next(
      new AppError("You can only update a menu you created as a vendor", 400)
    );
  }

  const updatedMenu = await existingMenu.update({ ...body });

  res.status(201).json({
    status: "success",
    data: updatedMenu,
  });
});

const deleteMenu = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return next(new AppError("Invalid menu id", 400));
  }

  if (Number(existingMenu.vendor) !== userId) {
    return next(
      new AppError("You can only delete a menu you created as a vendor", 400)
    );
  }

  await existingMenu.destroy();

  res.status(201).json({
    status: "success",
    message: "Record deleted successfully",
  });
});

const viewMenuDetails = catchAsync(async (req, res, next) => {
  const menuId = req.params.id;

  const existingMenu = await menu.findByPk(menuId);

  if (!existingMenu) {
    return next(new AppError("Invalid menu id", 400));
  }
  res.status(201).json({
    status: "success",
    data: existingMenu,
  });
});

const listMenu = catchAsync(async (req, res, next) => {
  let menus;
  const isCustomer = auth.checkIsCustomer(req.user);

  if (isCustomer) {
    if (!req.query?.vendor) {
      return next(new AppError("Vendor id is required", 400));
    }
    const vendor = await user.findByPk(req.query.vendor);

    const isVendorACustomer = auth.checkIsCustomer(vendor);

    if (isVendorACustomer) {
      return next(new AppError("id provided is not a vendor", 400));
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

  res.status(200).json({
    status: "success",
    data: menus,
  });
});

module.exports = {
  createMenu,
  listMenu,
  updateMenu,
  deleteMenu,
  viewMenuDetails,
};
