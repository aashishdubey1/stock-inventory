import type { Request, Response } from "express";
import { LooseLengthRepository } from "../repositories/looseLength.repository";


export const addLooseLength = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const looseLength = await LooseLengthRepository.create(data);
        res.status(201).json({ message: "Loose length added successfully", looseLength });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLooseLengths = async (req: Request, res: Response) => {
    try {
        const { godownId, size } = req.query;

        const filters = {
            godownId: godownId ? Number(godownId) : undefined,
            size: size ? String(size) : undefined,
        };

        const looseLengths = await LooseLengthRepository.findAll(filters);
        res.json({ looseLengths });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
