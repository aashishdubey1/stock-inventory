import prisma from "../config/prisma";
import { type User, Prisma } from "../../generated/prisma/client";

export class UserRepository {
    static async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    static async findByUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { username },
        });
    }

    static async create(data: Prisma.UserCreateInput | Prisma.UserUncheckedCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    static async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
