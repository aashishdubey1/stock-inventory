import prisma from "../config/prisma";
import { Prisma, TransactionType, type CableStock } from "../../generated/prisma/client";

export class CableStoreRepository {
    static async create(data: Prisma.CableStockCreateInput | Prisma.CableStockUncheckedCreateInput, userId: string): Promise<CableStock> {
        return prisma.$transaction(async (tx) => {
            const stock = await tx.cableStock.create({ data })

            const transaction = await tx.cableTransaction.create({
                data: {
                    cableStockId: Number(stock.id),
                    transactionType: TransactionType.IN,
                    quantity: Number(stock.initialQuantity),
                    balanceAfter: stock.initialQuantity,
                    dispatchedDate: new Date(),
                    dispatchedCompany: "",
                    invoiceNumber: "",
                    fromGodownId: null,
                    toGodownId: stock.godownId,

                    size: stock.size,
                    conductorType: stock.conductorType,
                    armourType: stock.armourType,
                    frls: stock.frls,
                    details: stock.details,
                    make: stock.make,
                    partNo: stock.partNo,
                    unit: "Meters",

                    userId: userId,

                }
            })

            if (!transaction) {
                throw new Error("Transaction not created");
            }

            return stock;
        })
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
