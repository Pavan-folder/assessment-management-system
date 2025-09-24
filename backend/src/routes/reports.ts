import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { ReportRequest, ReportResponse } from '../types';
import { catchAsync } from '../middleware/errorHandler';
import { generateReport } from '../services/reportService';

const router = express.Router();

// Generate assessment report
router.post('/generate', catchAsync(async (req: ReportRequest, res: express.Response) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({
      success: false,
      message: 'Session ID is required'
    });
  }

  try {
    const result = await generateReport(session_id);

    res.json({
      success: true,
      message: 'Report generated successfully',
      reportPath: result.reportPath,
      downloadUrl: result.downloadUrl
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
}));

// Get report status
router.get('/status/:session_id', authenticateToken, (req: express.Request, res: express.Response) => {
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
router.get('/download/:session_id', (req: express.Request, res: express.Response) => {
  const { session_id } = req.params;

  // In a real implementation, you'd serve the generated PDF file
  // For now, we'll return a mock response
  res.json({
    success: true,
    message: 'Report download initiated',
    sessionId: session_id
  });
});

export { router as reportRoutes };
