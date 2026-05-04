const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/public", reviewController.getPublicReviews);
router.get("/", auth, reviewController.getReviews);
router.get("/admin/all", auth, isAdmin, reviewController.getReviews);
router.patch("/status/:id", auth, isAdmin, reviewController.updateReviewStatus);
router.get("/dropdown-products", auth, reviewController.getProductDropdown);
router.get("/dropdown-customers", auth, reviewController.getCustomerDropdown);
router.post("/add", auth, reviewController.addReview);

module.exports = router;