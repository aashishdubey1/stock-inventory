/*
  Warnings:

  - The primary key for the `godowns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `godowns` on the `godowns` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConductorType" AS ENUM ('AL', 'CU');

-- CreateEnum
CREATE TYPE "ArmourType" AS ENUM ('ARM', 'FLEX', 'UNARM');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('RUNNING', 'DEPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_godown_id_fkey";

-- AlterTable
ALTER TABLE "godowns" DROP CONSTRAINT "godowns_pkey",
DROP COLUMN "godowns",
ADD COLUMN     "godowns_id" SERIAL NOT NULL,
ADD CONSTRAINT "godowns_pkey" PRIMARY KEY ("godowns_id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Searcher';

-- CreateTable
CREATE TABLE "cable_stocks" (
    "cable_stocks_id" SERIAL NOT NULL,
    "drum_number" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "conductor_type" "ConductorType" NOT NULL,
    "armour_type" "ArmourType" NOT NULL,
    "frls" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "stock_status" "StockStatus" NOT NULL DEFAULT 'RUNNING',
    "make" TEXT NOT NULL,
    "part_no" TEXT,
    "packaging_type" TEXT NOT NULL DEFAULT 'DRUM',
    "initial_quantity" DECIMAL(65,30) NOT NULL,
    "present_quantity" DECIMAL(65,30) NOT NULL,
    "godown_id" INTEGER NOT NULL,
    "site" TEXT NOT NULL,
    "location" TEXT,
    "is_multi_coil" BOOLEAN DEFAULT false,
    "number_of_cartons" INTEGER,
    "coils_per_carton" DECIMAL(65,30),
    "total_coils" DECIMAL(65,30),
    "coils_remaining" DECIMAL(65,30),
    "qty_per_coil" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cable_stocks_pkey" PRIMARY KEY ("cable_stocks_id")
);

-- CreateTable
CREATE TABLE "loose_lengths" (
    "loose_length_id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "conductor_type" "ConductorType" NOT NULL,
    "armour_type" "ArmourType" NOT NULL,
    "frls" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "stock_status" "StockStatus" NOT NULL,
    "make" TEXT NOT NULL,
    "part_no" TEXT,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "godown_id" INTEGER NOT NULL,

    CONSTRAINT "loose_lengths_pkey" PRIMARY KEY ("loose_length_id")
);

-- CreateTable
CREATE TABLE "CableTransaction" (
    "cable_transactions_id" SERIAL NOT NULL,
    "cable_stock_id" INTEGER,
    "loose_length_id" INTEGER,
    "transaction_type" "TransactionType" NOT NULL,
    "size" TEXT NOT NULL,
    "conductor_type" "ConductorType" NOT NULL,
    "armour_type" "ArmourType" NOT NULL,
    "frls" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "part_no" TEXT,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "balance_after" DECIMAL(65,30) NOT NULL,
    "coils_dispatched" DECIMAL(65,30),
    "dispatch_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatched_company" TEXT NOT NULL,
    "invoice_number" TEXT,
    "from_godown_id" INTEGER,
    "to_godown_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CableTransaction_pkey" PRIMARY KEY ("cable_transactions_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "categories_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categories_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cable_stocks_drum_number_key" ON "cable_stocks"("drum_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "godowns"("godowns_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_stocks" ADD CONSTRAINT "cable_stocks_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "godowns"("godowns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loose_lengths" ADD CONSTRAINT "loose_lengths_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "godowns"("godowns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableTransaction" ADD CONSTRAINT "CableTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableTransaction" ADD CONSTRAINT "CableTransaction_cable_stock_id_fkey" FOREIGN KEY ("cable_stock_id") REFERENCES "cable_stocks"("cable_stocks_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableTransaction" ADD CONSTRAINT "CableTransaction_loose_length_id_fkey" FOREIGN KEY ("loose_length_id") REFERENCES "loose_lengths"("loose_length_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableTransaction" ADD CONSTRAINT "CableTransaction_from_godown_id_fkey" FOREIGN KEY ("from_godown_id") REFERENCES "godowns"("godowns_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableTransaction" ADD CONSTRAINT "CableTransaction_to_godown_id_fkey" FOREIGN KEY ("to_godown_id") REFERENCES "godowns"("godowns_id") ON DELETE SET NULL ON UPDATE CASCADE;
