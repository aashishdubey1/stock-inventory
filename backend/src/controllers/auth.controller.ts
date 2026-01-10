import type { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { comparePassword, generateToken, hashPassword } from "../utils/auth.utils";
import type { AuthRequest } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role: roleInput, godownId } = req.body;

        const existingUser = await UserRepository.findByEmail(email) || await UserRepository.findByUsername(username);

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const role: Role = (roleInput && Object.values(Role).includes(roleInput)) ? roleInput : Role.Searcher;

        const user = await UserRepository.create({
            email,
            username,
            password: hashedPassword,
            role,
            godownId,
        });

        const token = generateToken({ userId: user.id, role: user.role });

        res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserRepository.findByEmail(email);

        if (!user || !(await comparePassword(password, user.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({ message: "Account is inactive" });
            return;
        }

        const token = generateToken({ userId: user.id, role: user.role });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const me = async (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
};
