-- CreateTable
CREATE TABLE "TaskReview" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "submissionLink" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "progressAdded" INTEGER,
    "progressTotal" INTEGER,
    "status" "TaskSubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "feedback" TEXT,

    CONSTRAINT "TaskReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskReview" ADD CONSTRAINT "TaskReview_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
