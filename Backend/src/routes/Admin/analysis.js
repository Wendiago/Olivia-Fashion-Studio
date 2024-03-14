const express = require('express');
const router = express.Router();
const analysisController = require('../../controllers/Admin/analysisController');
const { verifyToken, verifyTokenAndAdminAuth } = require('../../controllers/middlewareController');


router.get('/topselling', verifyTokenAndAdminAuth, analysisController.getTopSellingProducts);

router.get('/total-order', verifyTokenAndAdminAuth, analysisController.getOrderCount);

router.get('/total-revenue', verifyTokenAndAdminAuth, analysisController.getTotalRevenue);

router.get('/daily-revenue', verifyTokenAndAdminAuth, analysisController.getDailyRevenue);

router.get('/weekly-revenue', verifyTokenAndAdminAuth, analysisController.getWeeklyRevenue);

router.get('/monthly-revenue', verifyTokenAndAdminAuth, analysisController.getMonthlyRevenue);

router.get('/yearly-revenue', verifyTokenAndAdminAuth, analysisController.getYearlyRevenue);

module.exports = router;