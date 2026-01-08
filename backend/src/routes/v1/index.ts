import { Router } from "express";
import authRoutes from "./auth.routes";
import godownRoutes from "./godown.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/godowns", godownRoutes);

export default router;
