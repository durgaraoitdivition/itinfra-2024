const { getUsers, getReceiversByOrderId, getDetailsbyOderid, createOrder, updateCourierNo, updateStatus, updateFromSMS, reSendSMS, getTotalInorOutwardItems, getItemwiseInOutwards, getStockBetweenDates, getItemsBetweenDates } = require("../controller/orders.ctrl");
const router  = require("express").Router();

router.get("/", getUsers);
router.get("/receivers/:orderid", getReceiversByOrderId);
router.get("/details/:orderid", getDetailsbyOderid);
router.post("/create", createOrder);
router.post("/updatecourierno", updateCourierNo);
router.post("/updatestatus", updateStatus);
router.post("/updatefromsms", updateFromSMS);
router.post("/resendsms", reSendSMS);

router.post("/totalinoutwarditems", getTotalInorOutwardItems);
router.post("/itemwiseinoutwards", getItemwiseInOutwards);

router.post("/stockbtndates", getStockBetweenDates);
router.post("/itembtndates", getItemsBetweenDates);



module.exports = router;