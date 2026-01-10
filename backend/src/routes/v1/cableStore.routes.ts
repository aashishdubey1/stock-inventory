import { Router } from "express";
import { addStock, getCableStocks } from "../../controllers/cableStore.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCableStockSchema } from "../../validations/cableStore.validation";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getCableStocks);

router.post("/", authenticate, authorize([Role.Supervisor, Role.StockInCharge]), validate(createCableStockSchema), addStock);

export default router;
