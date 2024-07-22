const menuService = require("../services/menuService");
const catchAsync = require("../utils/catchAsync");

const createMenu = catchAsync(async (req, res) => {
  const response = await menuService.createMenu(req);
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

const updateMenu = catchAsync(async (req, res) => {
  const response = await menuService.updateMenu(req);
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

const deleteMenu = catchAsync(async (req, res) => {
  const response = await menuService.deleteMenu(req);
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

const viewMenuDetails = catchAsync(async (req, res) => {
  const response = await menuService.viewMenuDetails(req);
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

const listMenu = catchAsync(async (req, res) => {
  const response = await menuService.listMenu(req);
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
  createMenu,
  listMenu,
  updateMenu,
  deleteMenu,
  viewMenuDetails,
};
