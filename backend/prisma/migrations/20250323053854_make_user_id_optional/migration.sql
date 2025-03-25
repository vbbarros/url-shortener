-- DropForeignKey
ALTER TABLE "short_urls" DROP CONSTRAINT "short_urls_userId_fkey";

-- AlterTable
ALTER TABLE "short_urls" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "short_urls" ADD CONSTRAINT "short_urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
