import type { Request, Response } from "express";
import { TransactionRepository } from "../repositories/transaction.repository";
import { dispatchSchema } from "../validations/transaction.validation";
import type { AuthRequest } from "../middlewares/auth.middleware";

export const dispatchStock = async (req: AuthRequest, res: Response) => {
    try {
        // req.body already validated by middleware, but types might need assertion if not using strict generic middleware typing
        const data = req.body;

        // We need user ID from the authenticated token
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const transaction = await TransactionRepository.dispatchStock({
            ...data,
            userId
        });

        res.status(201).json({ message: "Stock dispatched successfully", transaction });
    } catch (error: any) {
        console.error(error);
        if (error.message.includes("Insufficient stock") || error.message.includes("not found")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const transferStock = async (req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "Transfer feature coming soon" });
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const godownId = req.query.godownId ? parseInt(req.query.godownId as string) : undefined;

        const transactions = await TransactionRepository.getRecentTransactions({
            limit,
            godownId
        });

        res.status(200).json({ transactions });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
