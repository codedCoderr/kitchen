const menuService = require("../services/menuService");
const catchAsync = require("../utils/catchAsync");
const responseService = require("../utils/response.service");

const createMenu = catchAsync(async (req, res, next) => {
  try {
    const response = await menuService.createMenu(req);

    responseService.success(
      res,
      "Menu created successfully",
      responseService.statusCodes.created,
      response
    );
  } catch (error) {
    next(error);
  }
});

const updateMenu = catchAsync(async (req, res, next) => {
  try {
    const response = await menuService.updateMenu(req);

    responseService.success(
      res,
      "Menu updated successfully",
      responseService.statusCodes.ok,
      response
    );
  } catch (error) {
    next(error);
  }
});

const deleteMenu = catchAsync(async (req, res, next) => {
  try {
    await menuService.deleteMenu(req);

    responseService.success(
      res,
      "Menu deleted successfully",
      responseService.statusCodes.noContent
    );
  } catch (error) {
    next(error);
  }
});

const viewMenuDetails = catchAsync(async (req, res, next) => {
  try {
    const response = await menuService.viewMenuDetails(req);

    responseService.success(
      res,
      "Menu details fetched successfully",
      responseService.statusCodes.ok,
      response
    );
  } catch (error) {
    next(error);
  }
});

const listMenu = catchAsync(async (req, res, next) => {
  try {
    const response = await menuService.listMenu(req);

    responseService.success(
      res,
      "Vendor's menus fetched successfully",
      responseService.statusCodes.ok,
      response
    );
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createMenu,
  listMenu,
  updateMenu,
  deleteMenu,
  viewMenuDetails,
};
