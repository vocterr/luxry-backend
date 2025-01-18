/*
  Warnings:

  - Made the column `resetPin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetPin" SET NOT NULL,
ALTER COLUMN "resetPin" SET DEFAULT '',
ALTER COLUMN "resetPin" SET DATA TYPE TEXT;
