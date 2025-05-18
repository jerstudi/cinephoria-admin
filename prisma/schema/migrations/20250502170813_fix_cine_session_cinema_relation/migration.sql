/*
  Warnings:

  - You are about to drop the `_CineSessionToCinema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CineSessionToCinema" DROP CONSTRAINT "_CineSessionToCinema_A_fkey";

-- DropForeignKey
ALTER TABLE "_CineSessionToCinema" DROP CONSTRAINT "_CineSessionToCinema_B_fkey";

-- DropTable
DROP TABLE "_CineSessionToCinema";

-- AddForeignKey
ALTER TABLE "CineSession" ADD CONSTRAINT "CineSession_cineId_fkey" FOREIGN KEY ("cineId") REFERENCES "Cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
