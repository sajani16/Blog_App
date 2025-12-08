const express = require("express");
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/userController");

const router = express.Router();

// router.post("/createuser", createUser);
router.get("/getuser", getUsers);
router.get("/getuser/:id", getUser);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
