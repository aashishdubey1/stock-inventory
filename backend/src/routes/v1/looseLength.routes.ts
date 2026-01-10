import { Router } from "express";
import { addLooseLength, getLooseLengths } from "../../controllers/looseLength.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createLooseLengthSchema } from "../../validations/looseLength.validation";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getLooseLengths);

router.post("/", authenticate, authorize([Role.Supervisor, Role.StockInCharge]), validate(createLooseLengthSchema), addLooseLength);

export default router;
