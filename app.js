const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const vendorRouter = require("./routes/vendor");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
require("dotenv").config({ path: `${process.cwd()}/.env` });
const responseService = require("./utils/response.service");

const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  responseService.success(
    res,
    "Welcome to the Kitchen",
    responseService.statusCodes.ok
  );
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/vendor", vendorRouter);
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError("Invalid route", responseService.statusCodes.notFound);
  })
);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
