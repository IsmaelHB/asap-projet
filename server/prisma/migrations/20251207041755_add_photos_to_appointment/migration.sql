-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
