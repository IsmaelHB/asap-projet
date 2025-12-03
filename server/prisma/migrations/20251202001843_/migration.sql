-- CreateEnum
CREATE TYPE "CallMode" AS ENUM ('NONE', 'AUTO_AI', 'ARTISAN_DECIDES');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('NOT_NEEDED', 'PENDING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "callBy" TEXT,
ADD COLUMN     "callMode" "CallMode" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "callStatus" "CallStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "callSummary" TEXT;
