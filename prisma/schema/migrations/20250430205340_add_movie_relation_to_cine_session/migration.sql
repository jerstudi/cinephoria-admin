-- AddForeignKey
ALTER TABLE "CineSession" ADD CONSTRAINT "CineSession_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
