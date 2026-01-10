import { z } from "zod";

export const dispatchSchema = z.object({
    cableStockId: z.number().optional(),
    looseLengthId: z.number().optional(),
    quantity: z.number().positive("Quantity must be positive"),

    // Specific to Dispatch (OUT)
    dispatchedCompany: z.string().min(1, "Dispatched company is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.coerce.date().optional(), // Coerce string to Date
    coilsDispatched: z.number().optional(),

    // Optional Godown context if needed (though implied by stock location)
    // Usually dispatch is FROM the godown where stock resides.
}).refine(data => data.cableStockId || data.looseLengthId, {
    message: "Either cableStockId or looseLengthId must be provided"
});

export const transferSchema = z.object({
    cableStockId: z.number().optional(),
    looseLengthId: z.number().optional(),
    quantity: z.number().positive("Quantity must be positive"),

    toGodownId: z.number({ message: "Target Godown ID (toGodownId) is required" }),
}).refine(data => data.cableStockId || data.looseLengthId, {
    message: "Either cableStockId or looseLengthId must be provided"
});
