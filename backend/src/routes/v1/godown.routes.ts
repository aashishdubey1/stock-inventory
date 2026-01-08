import { Router } from "express";
import { createGodown, deleteGodown, getAllGodowns, getGodownById, updateGodown } from "../../controllers/godown.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createGodownSchema, updateGodownSchema } from "../../validations/godown.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();



router.get("/", authenticate, getAllGodowns);
router.get("/:id", authenticate, getGodownById);

router.post("/", authenticate, authorize([Role.Supervisor]), validate(createGodownSchema), createGodown);
router.put("/:id", authenticate, authorize([Role.Supervisor]), validate(updateGodownSchema), updateGodown);
router.delete("/:id", authenticate, authorize([Role.Supervisor]), deleteGodown);

export default router;
