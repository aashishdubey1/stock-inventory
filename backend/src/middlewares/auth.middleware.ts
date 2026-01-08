import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.utils";
import prisma from "../config/prisma";
import { Role } from "../../generated/prisma/client";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: Role;
        email: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }

    try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, email: true },
        });

        if (!user) {
            res.status(401).json({ message: "Invalid user" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const authorize = (allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }

        next();
    };
};
