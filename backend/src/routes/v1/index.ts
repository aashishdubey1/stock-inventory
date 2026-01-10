import { Router } from "express";
import authRoutes from "./auth.routes";
import godownRoutes from "./godown.routes";
import cableStoreRoutes from "./cableStore.routes";
import looseLengthRoutes from "./looseLength.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/godowns", godownRoutes);
router.use("/cables", cableStoreRoutes);
router.use("/loose-lengths", looseLengthRoutes);
router.use("/transactions", transactionRoutes);

export default router;
