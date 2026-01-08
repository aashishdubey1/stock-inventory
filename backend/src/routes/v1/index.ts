import { Router } from "express";
import authRoutes from "./auth.routes";
import godownRoutes from "./godown.routes";
import cableStoreRoutes from "./cableStore.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/godowns", godownRoutes);
router.use("/cables", cableStoreRoutes);

export default router;
