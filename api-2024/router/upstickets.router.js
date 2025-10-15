const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketsNumber, getTicketById, getTicketByTicketNo, getTicketsByUserId, updateTicket, deleteTicket } = require("../controller/upstickets.ctrl");

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/latesttid", getTicketsNumber);
router.get("/getbyid/:utid", getTicketById);
router.get("/ticketno/:tid", getTicketByTicketNo);
router.get("/user/:userid", getTicketsByUserId);
router.put("/update/:utid", updateTicket);
router.delete("/delete/:utid", deleteTicket);

module.exports = router;
