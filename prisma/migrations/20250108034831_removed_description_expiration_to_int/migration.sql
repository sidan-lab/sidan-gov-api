/*
  Warnings:

  - You are about to drop the column `governance_description` on the `Proposal` table. All the data in the column will be lost.
  - The `expiration` column on the `Proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "governance_description",
DROP COLUMN "expiration",
ADD COLUMN     "expiration" INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
