/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_productId_key" ON "Image"("productId");
