"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const reportService_1 = require("../services/reportService");
const router = express_1.default.Router();
exports.reportRoutes = router;
// Generate assessment report
router.post('/generate', auth_1.authenticateToken, (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { session_id } = req.body;
    if (!session_id) {
        return res.status(400).json({
            success: false,
            message: 'Session ID is required'
        });
    }
    try {
        const result = await (0, reportService_1.generateReport)(session_id);
        res.json({
            success: true,
            message: 'Report generated successfully',
            reportPath: result.reportPath,
            downloadUrl: result.downloadUrl
        });
    }
    catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate report'
        });
    }
}));
// Get report status
router.get('/status/:session_id', auth_1.authenticateToken, (req, res) => {
    const { session_id } = req.params;
    // In a real implementation, you'd check the report generation status
    // For now, we'll return a mock status
    res.json({
        success: true,
        sessionId: session_id,
        status: 'completed',
        message: 'Report generation completed'
    });
});
// Download report
router.get('/download/:session_id', auth_1.authenticateToken, (req, res) => {
    const { session_id } = req.params;
    // In a real implementation, you'd serve the generated PDF file
    // For now, we'll return a mock response
    res.json({
        success: true,
        message: 'Report download initiated',
        sessionId: session_id
    });
});
//# sourceMappingURL=reports.js.map