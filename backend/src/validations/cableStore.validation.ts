import { z } from "zod";
import { ArmourType, ConductorType, StockStatus } from "../../generated/prisma/enums";

export const createCableStockSchema = z.object({
    drumNumber: z.string().min(1, "Drum number is required"),
    size: z.string().min(1, "Size is required"),
    conductorType: z.enum(ConductorType),
    armourType: z.enum(ArmourType),
    frls: z.string().min(1, "FRLS is required"),
    details: z.string().min(1, "Details are required"),
    stockStatus: z.enum(StockStatus).optional().default(StockStatus.RUNNING),
    make: z.string().min(1, "Make is required"),
    partNo: z.string().optional(),
    packagingType: z.string().default("DRUM"),
    initialQuantity: z.number().min(0, "Initial quantity must be positive"),
    presentQuantity: z.number().min(0, "Present quantity must be positive"),
    godownId: z.number({ message: "Godown ID is required" }),
    site: z.string().min(1, "Site is required"),
    location: z.string().optional(),

    isMultiCoil: z.boolean().optional(),
    numberOfCartons: z.number().optional(),
    coilsPerCarton: z.number().optional(),
    totalCoils: z.number().optional(),
    coilsRemaining: z.number().optional(),
    qtyPerCoil: z.number().optional(),
}).refine(data => {
    return true;
});

export const getCableStockSchema = z.object({
    godownId: z.number().optional(),
    drumNumber: z.string().optional(),
});
