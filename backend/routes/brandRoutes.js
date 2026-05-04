const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");

router.post("/", auth, isAdmin, brandController.createBrand);
router.get("/", auth, isAdmin, brandController.getBrands);
router.put("/:id", auth,  isAdmin, brandController.updateBrand);
router.patch("/status/:id", auth,  isAdmin, brandController.updateStatus); // Status ke liye PATCH ya PUT
router.delete("/:id", auth, isAdmin, brandController.deleteBrand);

module.exports = router;