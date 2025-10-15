const express = require('express');
const router = express.Router();
const {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
} = require("../controller/upsvendors.ctrl");

router.get("/", getAllVendors);
router.get("/getbyid/:upsvid", getVendorById);
router.post("/", createVendor);
router.put("/update/:upsvid", updateVendor);
router.delete("/delete/:upsvid", deleteVendor);

module.exports = router;
