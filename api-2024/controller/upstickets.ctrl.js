const pool = require("../config/database");
const util = require('util');
const query = util.promisify(pool.query).bind(pool);
require("./commonFunc")();

module.exports = {
    createTicket: async (req, res) => {
        try {
            const { ticketNo, companyName, mobileNo, alternateMobileNo, email, status, campus, userId, description } = req.body;
            if(req.createdAt){
                var createdAt = req.createdAt
            } else {
                var createdAt = mysqldatetime(new Date())
            }
            const curdate = mysqldatetime(new Date())
            const result = await query('INSERT INTO upsTickets (ticketNo, companyName, mobileNo, alternateMobileNo, email, campus, userId, status, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [ticketNo, companyName, mobileNo, alternateMobileNo, email, campus, userId, status, description, createdAt, curdate]);
            res.status(201).send({ utid: result.insertId });
        } catch (err) {
            console.log(err)
            res.status(500).send({ error: err.message });
        }
    },

    getTickets: async (req, res) => {
        try {
            const result = await query('SELECT t1.* FROM upsTickets t1 JOIN ( SELECT ticketNo, MAX(updatedAt) AS latestUpdate FROM upsTickets GROUP BY ticketNo) t2 ON t1.ticketNo = t2.ticketNo AND t1.updatedAt = t2.latestUpdate ORDER BY t1.ticketNo DESC');
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    getTicketsByUserId: async (req, res) => {
        try {
            const result = await query('SELECT t1.* FROM upsTickets t1 JOIN ( SELECT ticketNo, MAX(updatedAt) AS latestUpdate FROM upsTickets GROUP BY ticketNo) t2 ON t1.ticketNo = t2.ticketNo AND t1.updatedAt = t2.latestUpdate and t1.userId="'+req.params.userid+'" ORDER BY t1.ticketNo DESC');
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    getTicketsNumber: async (req, res) => {
        try {
            const result = await query('SELECT * FROM upsTickets order by ticketNo desc limit 1');
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    getTicketById: async (req, res) => {
        try {
            const result = await query('SELECT * FROM upsTickets WHERE utid = ?', [req.params.utid]);
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    getTicketByTicketNo: async (req, res) => {
        try {
            const result = await query('SELECT * FROM upsTickets WHERE ticketNo = ?', [req.params.tid]);
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    updateTicket: async (req, res) => {
        try {
            const { companyName, mobileNo, alternateMobileNo, email, status, address, userId, description } = req.body;
            await query('UPDATE upsTickets SET companyName = ?, mobileNo = ?, alternateMobileNo = ?, email = ?, status = ?, address = ?, userId = ?, description = ?, updatedAt = NOW() WHERE utid = ?', 
                [companyName, mobileNo, alternateMobileNo, email, status, address, userId, description, req.params.utid]);
            res.status(200).send({ message: "Ticket updated successfully" });
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    deleteTicket: async (req, res) => {
        try {
            await query('DELETE FROM upsTickets WHERE utid = ?', [req.params.utid]);
            res.status(200).send({ message: "Ticket deleted successfully" });
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    }
};
