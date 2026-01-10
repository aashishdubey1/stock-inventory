import { Router } from "express";
import { dispatchStock, transferStock, getTransactions } from "../../controllers/transaction.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { dispatchSchema, transferSchema } from "../../validations/transaction.validation";
import { Role } from "@prisma/client";

const router = Router();

// Get transactions - All authenticated users
router.get("/", authenticate, getTransactions);

// Dispatch (OUT) - Supervisor or StockInCharge
router.post("/out", authenticate, authorize([Role.Supervisor, Role.StockInCharge]), validate(dispatchSchema), dispatchStock);

// Transfer - Supervisor Only? or StockInCharge too?
router.post("/transfer", authenticate, authorize([Role.Supervisor, Role.StockInCharge]), validate(transferSchema), transferStock);

export default router;
