import express, { Request, Response, NextFunction, RequestHandler, Router } from "express";
import metricsController from "../controllers/metricsController";

const router: Router = express.Router();

router.get('/metrics', metricsController.getAllMetrics, (req: Request, res: Response): Response => {
  return res.status(200).json(res.locals.metrics);
})

export default router;