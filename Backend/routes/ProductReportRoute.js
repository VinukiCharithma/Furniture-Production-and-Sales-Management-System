const express = require('express');
const router = express.Router();
const { generateProductPDFReport } = require('../controllers/productReportController');

router.get('/generate-report', generateProductPDFReport);

module.exports = router;
