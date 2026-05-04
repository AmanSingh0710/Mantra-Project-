const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const employeeUploads = upload.fields([
  { name: "employee_image", maxCount: 1 },
  { name: "identity_image", maxCount: 1 }
]);

// CREATE
router.post("/add", auth, isAdmin, employeeUploads, controller.createEmployee);

// READ
router.get("/", auth, isAdmin, controller.getEmployees);
router.get("/:id", auth, isAdmin, controller.getEmployee);

// UPDATE
router.put("/:id", auth, isAdmin, employeeUploads, controller.updateEmployee);

// DELETE
router.delete("/:id", auth, isAdmin, controller.deleteEmployee);

// STATUS UPDATE
router.patch("/status/:id", auth, isAdmin, controller.updateStatus);

module.exports = router;