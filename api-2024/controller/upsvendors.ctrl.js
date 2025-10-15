const pool = require("../config/database");
const util = require('util');
const query = util.promisify(pool.query).bind(pool);

module.exports = {
    getAllVendors: async (req, res, next) => {
        try {
            const result = await query('SELECT * FROM upsVendorDetails');
            res.status(200).send(result);
        } catch (err) {
            res.send({ error: err.message });
        }
    },
    getVendorById: async (req, res, next) => {
        try {
            const result = await query('SELECT * FROM upsVendorDetails WHERE upsvid = ?', [req.params.upsvid]);
            res.status(200).send(result);
        } catch (err) {
            res.send({ error: err.message });
        }
    },
    createVendor: async (req, res, next) => {
        try {
            const { upsvname, upsvcity, upsvphone, upsaltphone, upsvemail } = req.body;
            const result = await query('INSERT INTO upsVendorDetails (upsvname, upsvcity, upsvphone, upsaltphone, upsvemail) VALUES (?, ?, ?, ?, ?)', [upsvname, upsvcity, upsvphone, upsaltphone, upsvemail]);
            res.status(201).send({ id: result.insertId, ...req.body });
        } catch (err) {
            res.send({ error: err.message });
        }
    },
    updateVendor: async (req, res, next) => {
        try {
            const { upsvname, upsvcity, upsvphone, upsaltphone, upsvemail } = req.body;
            const result = await query('UPDATE upsVendorDetails SET upsvname = ?, upsvcity = ?, upsvphone = ?,  upsaltphone = ?, upsvemail = ? WHERE upsvid = ?', [upsvname, upsvcity, upsvphone, upsaltphone, upsvemail, req.params.upsvid]);
            res.status(200).send({ id: req.params.upsvid, ...req.body });
        } catch (err) {
            res.send({ error: err.message });
        }
    },
    deleteVendor: async (req, res, next) => {
        try {
            await query('DELETE FROM upsVendorDetails WHERE upsvid = ?', [req.params.upsvid]);
            res.status(200).send({ message: 'Vendor deleted successfully' });
        } catch (err) {
            res.send({ error: err.message });
        }
    }
};
