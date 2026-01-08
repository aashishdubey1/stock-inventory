import type { Request, Response } from "express";
import { CableStoreRepository } from "../repositories/cableStore.repository";
import { getCableStockSchema } from "../validations/cableStore.validation";

export const addStock = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const existingDrum = await CableStoreRepository.findByDrumNumber(data.drumNumber);

        if (existingDrum) {
            res.status(400).json({ message: `Drum ${data.drumNumber} already exists` });
            return;
        }

        const cableStock = await CableStoreRepository.create(data);
        res.status(201).json({ message: "Cable stock added successfully", cableStock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCableStocks = async (req: Request, res: Response) => {
    try {
        const { godownId, drumNumber } = req.query;

        const filters = {
            godownId: godownId ? parseInt(godownId as string) : undefined,
            drumNumber: drumNumber as string,
        };

        const cableStocks = await CableStoreRepository.findAll(filters);
        res.json({ cableStocks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
