const Router = require("express");
const {
  viewVendorDetails,
  listVendors,
} = require("../controllers/vendorController");
const { authentication, restrictTo } = require("../controllers/authController");
const router = Router();

router.route("/:id").get(authentication, restrictTo("2"), viewVendorDetails);
router.route("/").get(authentication, restrictTo("2"), listVendors);

module.exports = router;
