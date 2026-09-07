import { computeOverview, computeSales, computePerformance } from '../services/analyticsService.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function overview(_req, res, next) {
  try {
    const data = await computeOverview();
    res.json({ success: true, analytics: data });
  } catch (err) {
    next(err);
  }
}

export async function sales(req, res, next) {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const data = await computeSales(days);
    res.json({ success: true, analytics: data });
  } catch (err) {
    next(err);
  }
}

export async function performance(_req, res, next) {
  try {
    const data = await computePerformance();
    res.json({ success: true, analytics: data });
  } catch (err) {
    next(err);
  }
}

// Re-exported guard for route wiring clarity
export { ApiError };
