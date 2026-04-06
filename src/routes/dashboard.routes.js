import { Router } from "express";

import authenticate from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";
import{
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getWeeklyTrends,
    getRecentAcitivity
} from "../controllers/dashboard.controller.js";

const router=Router();

router.use(authenticate);//on all routes

router.get("/summary",roleGuard("viewer","analyst","admin"),getSummary);
router.get("/recent",roleGuard("viewer", "analyst", "admin"),getRecentAcitivity);

//analyst + admin only
router.get("/categories",roleGuard("analyst","admin"),getCategoryTotals);
router.get("/trends/monthly",roleGuard("analyst","admin"),getMonthlyTrends);
router.get("/trends/weekly", roleGuard("analyst", "admin"), getWeeklyTrends);

export default router;