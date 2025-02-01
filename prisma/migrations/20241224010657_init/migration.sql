-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "is_staked_to_sidan" BOOLEAN,
    "is_drep_delegated_to_sidan" BOOLEAN,
    "wallet_address" TEXT,
    "stake_key_lovelace" DOUBLE PRECISION,
    "jwt" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "cert_index" TEXT,
    "governance_type" TEXT,
    "governance_description" TEXT,
    "expiration" TIMESTAMP(3),
    "metadata" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT,
    "user_id" TEXT,
    "vote" "VoteType",
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_tx_hash_key" ON "Proposal"("tx_hash");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
