import prisma from "../config/prisma";
import { Prisma, type Godown } from "../../generated/prisma/client";

export class GodownRepository {
    static async create(data: Prisma.GodownCreateInput): Promise<Godown> {
        return prisma.godown.create({
            data,
        });
    }

    static async findAll(): Promise<Godown[]> {
        return prisma.godown.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    static async findById(id: number): Promise<Godown | null> {
        return prisma.godown.findUnique({
            where: { id },
        });
    }

    static async update(id: number, data: Prisma.GodownUpdateInput): Promise<Godown> {
        return prisma.godown.update({
            where: { id },
            data,
        });
    }

    static async delete(id: number): Promise<Godown> {
        return prisma.godown.delete({
            where: { id },
        });
    }
}
