-- CreateEnum
CREATE TYPE "TaskSubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'CHANGES_REQUESTED', 'APPROVED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "mentorFeedback" TEXT,
ADD COLUMN     "progressPct" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "submissionLink" TEXT,
ADD COLUMN     "submissionStatus" "TaskSubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
ADD COLUMN     "submittedAt" TIMESTAMP(3);
