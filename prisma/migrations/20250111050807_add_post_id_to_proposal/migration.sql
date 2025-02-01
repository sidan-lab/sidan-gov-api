/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `post_id` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "post_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_post_id_key" ON "Proposal"("post_id");
