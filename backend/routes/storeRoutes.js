const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // ✅ use this only

// Upload fields config
const cpUpload = upload.fields([
  { name: "vendorImage", maxCount: 1 },
  { name: "shopLogo", maxCount: 1 },
  { name: "shopBanner", maxCount: 1 },
]);

// Routes
router.get("/", auth, isAdmin, storeController.getStores);
router.post("/", auth, isAdmin, cpUpload, storeController.createStore);
router.put("/:id", auth, isAdmin, cpUpload, storeController.updateStore);
router.patch("/:id", auth, isAdmin, storeController.patchStore);
router.delete("/:id", auth, isAdmin, storeController.deleteStore);

module.exports = router;
