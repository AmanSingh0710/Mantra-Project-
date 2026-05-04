const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/Deliverymans/deliveryManController');
const auth = require('../middleware/auth');
const isAdmin = require("../middleware/isAdmin");

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Routes matching frontend logic
router.post('/add-deliveryman', auth, isAdmin, upload.fields([
    { name: 'deliveryman_image', maxCount: 1 },
    { name: 'identity_image', maxCount: 1 }
]), controller.addDeliveryMan);

router.get('/list', auth, isAdmin, controller.getAllDeliveryMen);
router.put('/update/:id', auth, isAdmin, upload.fields([{ name: 'deliveryman_image' }, { name: 'identity_image' }]), controller.updateDeliveryMan);
router.put('/update-status/:id', auth, isAdmin, controller.toggleStatus);
router.delete('/delete/:id', auth, isAdmin, controller.deleteDeliveryMan);
router.post('/delivery-login', controller.deliveryManLogin);

// Frontend ke dropdown ke liye static data route
router.get('/identity-types', auth, isAdmin);

module.exports = router;