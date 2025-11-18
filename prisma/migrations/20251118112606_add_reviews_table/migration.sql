/*
  Warnings:

  - You are about to drop the column `feedback` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `internalNotes` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `submissions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "submissions_submittedAt_idx";

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "feedback",
DROP COLUMN "grade",
DROP COLUMN "internalNotes",
DROP COLUMN "reviewedAt";

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "grade" INTEGER,
    "internalNotes" TEXT,
    "feedback" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_submissionId_idx" ON "reviews"("submissionId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
