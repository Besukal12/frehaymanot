/*
  Warnings:

  - You are about to drop the column `created_at` on the `Mezmur` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `Mezmur` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Mezmur` table. All the data in the column will be lost.
  - You are about to drop the column `storagePath` on the `Mezmur` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Mezmur` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `MezmurCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `MezmurCategory` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Mezmur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `MezmurCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MezmurCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mezmur" DROP COLUMN "created_at",
DROP COLUMN "fileName",
DROP COLUMN "mimeType",
DROP COLUMN "storagePath",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pdfStorageId" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MezmurCategory" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
