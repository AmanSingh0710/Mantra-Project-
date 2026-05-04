const express = require("express");
const router = express.Router();
const attributeController = require("../controllers/attributeController");
const auth =  require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


router.get("/", auth, isAdmin, attributeController.getAttributes);          
router.post("/", auth, isAdmin, attributeController.createAttribute);      
router.put("/:id", auth, isAdmin, attributeController.updateAttribute);    
router.delete("/:id", auth, isAdmin, attributeController.deleteAttribute);  

module.exports = router;