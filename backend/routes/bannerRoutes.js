const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// without login user
router.get("/public", bannerController.getBanners);

//only admin
router.post("/", auth, isAdmin, upload.single("image"),  bannerController.createBanner);
router.get("/", auth, isAdmin, bannerController.getBanners);
router.patch("/toggle/:id", auth, isAdmin, bannerController.toggleBannerStatus); 
router.delete("/:id", auth, isAdmin, bannerController.deleteBanner);
router.put("/:id", auth, isAdmin, upload.single("image"),  bannerController.updateBanner);

module.exports = router;