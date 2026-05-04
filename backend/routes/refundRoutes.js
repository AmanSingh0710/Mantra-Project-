const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// 1. Create
router.post('/add', auth, isAdmin, refundController.createRefund);

// 2. Read (All, Status filter, Search)
router.get('/', auth, isAdmin, refundController.getAllRefunds);

// 3. Update (Status change or Edit)
router.patch('/:id', auth, isAdmin, refundController.updateRefund);

// 4. Delete
router.delete('/:id', auth, isAdmin, refundController.deleteRefund);

module.exports = router;