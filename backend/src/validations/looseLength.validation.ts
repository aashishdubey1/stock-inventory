import { z } from "zod";
import { ArmourType, ConductorType, StockStatus } from "../../generated/prisma/enums";

export const createLooseLengthSchema = z.object({
    size: z.string().min(1, "Size is required"),
    conductorType: z.enum(ConductorType),
    armourType: z.enum(ArmourType),
    frls: z.string().min(1, "FRLS is required"),
    details: z.string().min(1, "Details are required"),
    stockStatus: z.enum(StockStatus).default(StockStatus.RUNNING),
    make: z.string().min(1, "Make is required"),
    partNo: z.string().optional(),

    quantity: z.number().positive("Quantity must be positive"),
    unit: z.string().min(1, "Unit is required"),

    godownId: z.number({ message: "Godown ID is required" }),
});

export const getLooseLengthSchema = z.object({
    godownId: z.number().optional(),
    size: z.string().optional(),
});
