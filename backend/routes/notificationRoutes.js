const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const auth = require("../middleware/auth"); 
const isAdmin = require("../middleware/isAdmin"); 

const manualCtrl = require("../controllers/Notifications/SendNotification");
const settingsCtrl = require("../controllers/Notifications/PushNotification");

// ================= ADMIN =================

// Notification create (admin)
router.post("/send", auth, isAdmin, upload.single("image"), manualCtrl.createNotification);

// All notifications (admin dashboard)
router.get("/admin/list", auth, isAdmin, manualCtrl.getAllNotifications);

// Send to specific user
router.post("/send-to-user", auth, isAdmin, manualCtrl.sendToUser);


// ================= USER =================

// Notification bell (user)
router.get("/user/list", auth, manualCtrl.getUserNotifications);

router.put("/read/:id", auth, manualCtrl.markAsRead);


// ================= SETTINGS =================

// Settings (admin only)
router.get("/settings", auth, isAdmin, settingsCtrl.getSettings);
router.post("/settings/update", auth, isAdmin, settingsCtrl.updateSettings);

module.exports = router;