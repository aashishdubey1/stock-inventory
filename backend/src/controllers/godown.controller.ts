import type { Request, Response } from "express";
import { GodownRepository } from "../repositories/godown.repository";
import { createGodownSchema, updateGodownSchema } from "../validations/godown.validation";

export const createGodown = async (req: Request, res: Response) => {
    try {
        const godown = await GodownRepository.create(req.body);
        res.status(201).json({ message: "Godown created successfully", godown });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllGodowns = async (req: Request, res: Response) => {
    try {
        const godowns = await GodownRepository.findAll();
        res.json({ godowns });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getGodownById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id!);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID" });
            return;
        }
        const godown = await GodownRepository.findById(id);
        if (!godown) {
            res.status(404).json({ message: "Godown not found" });
            return;
        }
        res.json({ godown });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateGodown = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id!);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID" });
            return;
        }

        const existing = await GodownRepository.findById(id);
        if (!existing) {
            res.status(404).json({ message: "Godown not found" });
            return;
        }

        const godown = await GodownRepository.update(id, req.body);
        res.json({ message: "Godown updated successfully", godown });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteGodown = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id!);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID" });
            return;
        }

        const existing = await GodownRepository.findById(id);
        if (!existing) {
            res.status(404).json({ message: "Godown not found" });
            return;
        }

        await GodownRepository.delete(id);
        res.json({ message: "Godown deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
