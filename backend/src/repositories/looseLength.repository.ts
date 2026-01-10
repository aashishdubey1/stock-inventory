import prisma from "../config/prisma";
import { Prisma, type LooseLength } from "@prisma/client";

export class LooseLengthRepository {
    static async create(data: Prisma.LooseLengthCreateInput | Prisma.LooseLengthUncheckedCreateInput): Promise<LooseLength> {
        return prisma.looseLength.create({
            data,
        });
    }

    static async findAll(filters: { godownId?: number; size?: string }): Promise<LooseLength[]> {
        const where: Prisma.LooseLengthWhereInput = { isDeleted: false };

        if (filters.godownId) {
            where.godownId = filters.godownId;
        }
        if (filters.size) {
            where.size = { contains: filters.size, mode: 'insensitive' };
        }

        return prisma.looseLength.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                godown: {
                    select: { name: true }
                }
            }
        });
    }
}
