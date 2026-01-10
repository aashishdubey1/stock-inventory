import prisma from "../config/prisma";
import { Prisma, TransactionType, type CableTransaction } from "@prisma/client";

export class TransactionRepository {
    /**
     * Dispatches stock (OUT transaction).
     * Reduces stock quantity and logs the transaction.
     * Throws error if insufficient balance.
     */
    static async dispatchStock(data: {
        cableStockId?: number;
        looseLengthId?: number;
        quantity: number;
        dispatchedCompany: string;
        invoiceNumber: string;
        invoiceDate?: Date;
        coilsDispatched?: number;
        userId: string;
    }): Promise<CableTransaction> {
        return await prisma.$transaction(async (tx) => {
            let balanceAfter: number = 0;
            let snapshotData: any = {};
            let fromGodownId: number | null = null;
            let unit: string = "Meters"; // Default

            if (data.cableStockId) {
                // Handle CableStock
                const stock = await tx.cableStock.findUnique({
                    where: { id: data.cableStockId }
                });

                if (!stock) {
                    throw new Error("Cable stock not found");
                }

                const currentQty = Math.round(stock.presentQuantity.toNumber() * 100) / 100;
                const requestedQty = Math.round(data.quantity * 100) / 100;

                // handle multi-coil
                if (stock.isMultiCoil) {
                    const coilsRemaining = stock.coilsRemaining?.toNumber() || 0;
                    const metersPerCoil = stock.qtyPerCoil?.toNumber() || 0;

                    // User MUST provide coilsDispatched for multi-coil
                    if (!data.coilsDispatched) {
                        throw new Error(
                            "This is a multi-coil carton. Please specify number of coils to dispatch."
                        );
                    }

                    // Validate: Can't dispatch more coils than available
                    if (data.coilsDispatched > coilsRemaining) {
                        throw new Error(
                            `Insufficient coils. Available: ${coilsRemaining} coils, Requested: ${data.coilsDispatched} coils`
                        );
                    }

                    // Calculate what the meters SHOULD be based on coils
                    const calculatedMeters = Math.round(data.coilsDispatched * metersPerCoil * 100) / 100;

                    // STRICT VALIDATION: User's entered meters must match calculated meters
                    if (requestedQty !== calculatedMeters) {
                        throw new Error(
                            `Mismatch: ${data.coilsDispatched} coils × ${metersPerCoil}m/coil = ${calculatedMeters}m, but you entered ${requestedQty}m. ` +
                            `For multi-coil cartons, you can only dispatch full coils.`
                        );
                    }

                    // All validations passed - proceed with dispatch

                } else {
                    // STANDARD DRUM - Can dispatch any quantity

                    // Validate quantity available
                    if (currentQty < requestedQty) {
                        throw new Error(
                            `Insufficient stock. Available: ${currentQty}m, Requested: ${requestedQty}m`
                        );
                    }
                }

                // Calculate balance after dispatch
                balanceAfter = Math.round((currentQty - requestedQty) * 100) / 100;
                fromGodownId = stock.godownId;
                unit = "Meters";

                // Prepare update data
                const updateData: any = {
                    presentQuantity: balanceAfter
                };

                // Update status if depleted
                if (balanceAfter === 0) {
                    updateData.stockStatus = 'Depleted';
                }

                // Update coils if multi-coil
                if (stock.isMultiCoil && data.coilsDispatched) {
                    const newCoilsRemaining = (stock.coilsRemaining?.toNumber() || 0) - data.coilsDispatched;
                    updateData.coilsRemaining = Math.max(0, newCoilsRemaining);
                }

                // Update stock
                await tx.cableStock.update({
                    where: { id: stock.id },
                    data: updateData
                });

                // Snapshot data
                snapshotData = {
                    size: stock.size,
                    conductorType: stock.conductorType,
                    armourType: stock.armourType,
                    frls: stock.frls,
                    details: stock.details,
                    make: stock.make,
                    partNo: stock.partNo,
                    unit: "Meters"
                };
            } else if (data.looseLengthId) {
                // Handle LooseLength
                const stock = await tx.looseLength.findUnique({ where: { id: data.looseLengthId } });
                if (!stock) throw new Error("Loose length stock not found");

                const currentQty = Math.round(stock.quantity.toNumber() * 100) / 100;
                const requestedQty = Math.round(data.quantity * 100) / 100;

                if (currentQty < requestedQty) {
                    throw new Error(`Insufficient stock. Available: ${currentQty}, Requested: ${requestedQty}`);
                }

                balanceAfter = currentQty - requestedQty;

                if (balanceAfter < 0) {
                    throw new Error(
                        `Critical error: Balance would be negative. Contact admin.`
                    );
                }

                fromGodownId = stock.godownId;
                unit = stock.unit;

                // Snapshot data
                snapshotData = {
                    size: stock.size,
                    conductorType: stock.conductorType,
                    armourType: stock.armourType,
                    frls: stock.frls,
                    details: stock.details,
                    make: stock.make,
                    partNo: stock.partNo,
                    unit: stock.unit
                };

                // Update Stock
                await tx.looseLength.update({
                    where: { id: stock.id },
                    data: { quantity: balanceAfter }
                });
            } else {
                throw new Error("Target stock (Cable or Loose) not specified");
            }

            // Create Transaction Record
            const transaction = await tx.cableTransaction.create({
                data: {
                    cableStockId: data.cableStockId,
                    looseLengthId: data.looseLengthId,
                    transactionType: TransactionType.OUT,

                    quantity: data.quantity,
                    balanceAfter: balanceAfter,
                    unit: snapshotData.unit || "Meters",

                    // Snapshot fields
                    size: snapshotData.size,
                    conductorType: snapshotData.conductorType,
                    armourType: snapshotData.armourType,
                    frls: snapshotData.frls,
                    details: snapshotData.details,
                    make: snapshotData.make,
                    partNo: snapshotData.partNo,

                    // Dispatch specifics
                    dispatchedCompany: data.dispatchedCompany,
                    invoiceNumber: data.invoiceNumber,
                    dispatchedDate: data.invoiceDate || new Date(),
                    coilsDispatched: data.coilsDispatched,

                    fromGodownId: fromGodownId,
                    userId: data.userId
                }
            });
            if (!transaction) {
                throw new Error("Failed to create transaction record");
            }
            return transaction;
        });


    }

    static async transferStock(data: {
        cableStockId?: number;
        looseLengthId?: number;
        quantity: number;
        toGodownId: number;
        userId: string;
    }): Promise<CableTransaction> {
        return await prisma.$transaction(async (tx) => {
            // Similar logic to dispatch but changing Godown ID or creating new entry in target godown?
            // Transfer logic:
            // 1. Deduct from Source Godown Stock.
            // 2. Add to Target Godown Stock (Find or Create?).
            // 3. Log TRANSFER transaction.

            // Complex part: If we transfer 50m from Drum A (100m) to Godown B, does Godown B get "Drum A" (50m)?
            // Or does it become a new Loose Length?
            // Usually, if a WHOLE Drum moves, we just update `godownId`.
            // If a CUT length moves, it likely becomes Loose Length in target.

            // For now, let's implement SIMPLE WHOLE DRUM movement or Loose Item movement.
            // Or partial transfer creating Loose Item at destination.

            // User asked for "Transfer".
            // Let's defer strict implementation details or do a simple "Update Location" for full drum, 
            // and "Create Loose Length" for partial?

            // Let's implement partial logic later. For now, strict 'dispatch' focus.
            throw new Error("Transfer logic pending detailed requirements (Full vs Partial)");
        });
    }

    /**
     * Get recent transactions with optional filtering
     */
    static async getRecentTransactions(params?: {
        limit?: number;
        godownId?: number;
        transactionType?: TransactionType;
    }) {
        const limit = params?.limit || 10;

        const where: any = {};
        if (params?.godownId) {
            where.fromGodownId = params.godownId;
        }
        if (params?.transactionType) {
            where.transactionType = params.transactionType;
        }

        const transactions = await prisma.cableTransaction.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                fromGodown: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                toGodown: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return transactions;
    }
}
