const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Create
router.post("/", auth, isAdmin, offerController.createOffer);

// Get All
router.get("/", auth, isAdmin, offerController.getAllOffers);

// Get Single
router.get("/:id", auth, isAdmin, offerController.getSingleOffer);

// Update
router.put("/:id", auth, isAdmin, offerController.updateOffer);

// Delete
router.delete("/:id", auth, isAdmin, offerController.deleteOffer);

// ✅ Get Active Offers (Public – User Side)
router.get("/active", offerController.getActiveOffers);

module.exports = router;
