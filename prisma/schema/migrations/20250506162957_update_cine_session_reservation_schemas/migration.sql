/*
  Warnings:

  - You are about to drop the column `cineSessionId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_cineSessionId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "cineSessionId";

-- CreateTable
CREATE TABLE "_CineSessionToReservation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CineSessionToReservation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CineSessionToReservation_B_index" ON "_CineSessionToReservation"("B");

-- AddForeignKey
ALTER TABLE "_CineSessionToReservation" ADD CONSTRAINT "_CineSessionToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "CineSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CineSessionToReservation" ADD CONSTRAINT "_CineSessionToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
