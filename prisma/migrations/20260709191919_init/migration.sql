-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cprId" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "departmentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "hodUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Department_hodUserId_fkey" FOREIGN KEY ("hodUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nationality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrainingTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "departmentId" TEXT,
    CONSTRAINT "TrainingTopic_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShortlistApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicantName" TEXT NOT NULL,
    "sourceDivision" TEXT,
    "trainingPeriodStart" DATETIME,
    "trainingPeriodEnd" DATETIME,
    "type" TEXT NOT NULL DEFAULT 'OFFLINE',
    "cvFileId" TEXT,
    "interestedDepartmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SHORTLISTED',
    "interviewRemarks" TEXT,
    "decidedByUserId" TEXT,
    "decidedAt" DATETIME,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShortlistApplication_cvFileId_fkey" FOREIGN KEY ("cvFileId") REFERENCES "FileAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ShortlistApplication_interestedDepartmentId_fkey" FOREIGN KEY ("interestedDepartmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShortlistApplication_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ShortlistApplication_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Intern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT,
    "dob" DATETIME,
    "mobile" TEXT,
    "address" TEXT,
    "email" TEXT,
    "universityName" TEXT,
    "universityContact" TEXT,
    "studentId" TEXT,
    "gpa" REAL,
    "major" TEXT,
    "yearOfStudy" TEXT,
    "nationalityId" TEXT,
    "doj" DATETIME,
    "dojRemarks" TEXT,
    "durationMonths" INTEGER,
    "departmentId" TEXT NOT NULL,
    "hodUserId" TEXT,
    "mentorUserId" TEXT,
    "projectName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Intern_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ShortlistApplication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Intern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Intern_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "Nationality" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Intern_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Intern_hodUserId_fkey" FOREIGN KEY ("hodUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Intern_mentorUserId_fkey" FOREIGN KEY ("mentorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "changedByUserId" TEXT,
    "notes" TEXT,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InternStatusHistory_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InternStatusHistory_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "responsesJson" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionnaireResponse_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetDate" DATETIME,
    "supervisorComments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Goal_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Timesheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "taskId" TEXT,
    "date" DATETIME NOT NULL,
    "checkIn" DATETIME,
    "checkOut" DATETIME,
    "totalHours" REAL,
    "progressPct" INTEGER DEFAULT 0,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Timesheet_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timesheet_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "isOverdue" BOOLEAN NOT NULL DEFAULT false,
    "hodNotifiedAt" DATETIME,
    CONSTRAINT "Meeting_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BiweeklyReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "categoryRatingsJson" TEXT NOT NULL,
    "consolidatedRating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BiweeklyReview_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BiweeklyReview_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinalRemark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "softSkillsScore" INTEGER NOT NULL,
    "technicalSkillsScore" INTEGER NOT NULL,
    "hireRecommended" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinalRemark_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinalRemark_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostInternshipFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "responsesJson" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostInternshipFeedback_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "certifiedByUserId" TEXT NOT NULL,
    "certifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hodScorecardReviewedAt" DATETIME,
    "fileUrl" TEXT,
    CONSTRAINT "Certificate_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_certifiedByUserId_fkey" FOREIGN KEY ("certifiedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingResource_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainingResource_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainingResource_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "internId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileAsset_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payloadJson" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "sentAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailNotificationSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "template" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cprId_key" ON "User"("cprId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_hodUserId_key" ON "Department"("hodUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_applicationId_key" ON "Intern"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_userId_key" ON "Intern"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireResponse_internId_key" ON "QuestionnaireResponse"("internId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalRemark_internId_key" ON "FinalRemark"("internId");

-- CreateIndex
CREATE UNIQUE INDEX "PostInternshipFeedback_internId_key" ON "PostInternshipFeedback"("internId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_internId_key" ON "Certificate"("internId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailNotificationSetting_eventKey_key" ON "EmailNotificationSetting"("eventKey");
