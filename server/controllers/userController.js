const users = require("../data/users");

/**
 * GET /api/users
 * Admin only – list all users
 */
function getUsers(req, res) {
  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }))
  );
}

/**
 * PUT /api/users/:id/role
 * Admin only – change user role
 */
function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "writer", "editor", "administrator"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

module.exports = { getUsers, updateUserRole };
