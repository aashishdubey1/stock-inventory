import prisma from "../config/prisma";
import { Prisma, type CableStock } from "../../generated/prisma/client";

export class CableStoreRepository {
    static async create(data: Prisma.CableStockCreateInput | Prisma.CableStockUncheckedCreateInput): Promise<CableStock> {
        return prisma.cableStock.create({
            data,
        });
    }

    static async findAll(filters: { godownId?: number; drumNumber?: string }): Promise<CableStock[]> {
        const where: Prisma.CableStockWhereInput = { isDeleted: false };

        if (filters.godownId) {
            where.godownId = filters.godownId;
        }
        if (filters.drumNumber) {
            where.drumNumber = { contains: filters.drumNumber, mode: 'insensitive' };
        }

        return prisma.cableStock.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                godown: {
                    select: { name: true }
                }
            }
        });
    }

    static async findByDrumNumber(drumNumber: string): Promise<CableStock | null> {
        return prisma.cableStock.findUnique({
            where: { drumNumber },
        });
    }
}
