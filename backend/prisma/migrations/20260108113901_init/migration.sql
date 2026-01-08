-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Searcher', 'StockInCharge', 'Supervisor');

-- CreateTable
CREATE TABLE "users" (
    "users" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "godown_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("users")
);

-- CreateTable
CREATE TABLE "godowns" (
    "godowns" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "godowns_pkey" PRIMARY KEY ("godowns")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "godowns_name_key" ON "godowns"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "godowns"("godowns") ON DELETE SET NULL ON UPDATE CASCADE;
