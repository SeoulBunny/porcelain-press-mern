const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const {
  getUsers,
  updateUserRole,
} = require("../controllers/userController");

// Admin only
router.get("/", auth, requireRole(["administrator"]), getUsers);
router.put("/:id/role", auth, requireRole(["administrator"]), updateUserRole);

module.exports = router;
