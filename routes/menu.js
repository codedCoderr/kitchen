const Router = require("express");
const {
  createMenu,
  updateMenu,
  deleteMenu,
  listMenu,
  viewMenuDetails,
} = require("../controllers/menuController");
const { authentication, restrictTo } = require("../utils/auth");
const router = Router();

router.route("/").post(authentication, restrictTo("1"), createMenu);
router.route("/:id").patch(authentication, restrictTo("1"), updateMenu);
router.route("/:id").delete(authentication, restrictTo("1"), deleteMenu);
router.route("/:id").get(authentication, restrictTo("2"), viewMenuDetails);
router.route("/").get(authentication, restrictTo("1", "2"), listMenu);

module.exports = router;
