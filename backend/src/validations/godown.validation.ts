import { z } from "zod";

export const createGodownSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location: z.string().min(1, "Location is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
});

export const updateGodownSchema = createGodownSchema.partial();
