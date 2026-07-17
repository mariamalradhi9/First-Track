import { PrismaClient, Role, ApplicationStatus, InternStatus, InternshipType, type Department, type Nationality, type User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEPARTMENTS = [
  { nameEn: "Information Technology", nameAr: "تقنية المعلومات" },
  { nameEn: "Finance", nameAr: "المالية" },
  { nameEn: "Marketing", nameAr: "التسويق" },
  { nameEn: "Human Resources", nameAr: "الموارد البشرية" },
];

const NATIONALITIES = [
  { nameEn: "Bahraini", nameAr: "بحريني" },
  { nameEn: "Saudi", nameAr: "سعودي" },
  { nameEn: "Emirati", nameAr: "إماراتي" },
  { nameEn: "Indian", nameAr: "هندي" },
  { nameEn: "Egyptian", nameAr: "مصري" },
];

const UNIVERSITIES = [
  "University of Bahrain",
  "Ahlia University",
  "Bahrain Polytechnic",
  "Applied Science University",
  "American University of Bahrain",
];

const MAJORS = [
  "Computer Science",
  "Business Administration",
  "Finance & Banking",
  "Marketing",
  "Information Systems",
  "Software Engineering",
];

const FIRST_NAMES = [
  "Ahmed", "Fatima", "Mohammed", "Aisha", "Ali", "Mariam", "Yousif", "Noor",
  "Khalid", "Layla", "Hassan", "Sara", "Omar", "Huda", "Salman", "Zainab",
  "Abdulla", "Reem", "Ibrahim", "Dana",
];
const FEMALE_FIRST_NAMES = new Set(["Fatima", "Aisha", "Mariam", "Noor", "Layla", "Sara", "Huda", "Zainab", "Reem", "Dana"]);
function genderFromName(fullName: string): "MALE" | "FEMALE" {
  const first = fullName.split(" ")[0];
  return FEMALE_FIRST_NAMES.has(first) ? "FEMALE" : "MALE";
}
const LAST_NAMES = [
  "Al-Khalifa", "Al-Amin", "Rashid", "Al-Sayed", "Mahmood", "Al-Ansari",
  "Jassim", "Al-Rumaihi", "Fakhro", "Al-Zayani", "Kamal", "Al-Hashimi",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}
const RATING_OPTIONS = ["Excellent", "Good", "Average", "Poor"];
function makeFeedbackResponses() {
  return {
    overallExperience: pick(RATING_OPTIONS),
    mentorSupport: pick(RATING_OPTIONS),
    skillsGained: "Improved technical proficiency and gained hands-on project experience.",
    suggestions: "More structured onboarding sessions in the first week would help.",
  };
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  console.log("Seeding…");
  const password = await bcrypt.hash("Passw0rd!", 10);

  // ---- master data ----
  const departments: Department[] = [];
  for (const d of DEPARTMENTS) departments.push(await prisma.department.create({ data: d }));

  const nationalities: Nationality[] = [];
  for (const n of NATIONALITIES) nationalities.push(await prisma.nationality.create({ data: n }));

  for (const dept of departments) {
    await prisma.trainingTopic.createMany({
      data: [
        { nameEn: `${dept.nameEn} Orientation`, nameAr: `تعريف ${dept.nameAr}`, departmentId: dept.id },
        { nameEn: `${dept.nameEn} Systems Overview`, nameAr: `نظرة عامة على أنظمة ${dept.nameAr}`, departmentId: dept.id },
      ],
    });
  }

  // ---- core users ----
  const superAdmin = await prisma.user.create({
    data: { cprId: "900000001", email: "admin@almoayyedcomputers.com", passwordHash: password, name: "System Administrator", role: Role.SUPER_ADMIN },
  });
  const ceo = await prisma.user.create({
    data: { cprId: "900000002", email: "ceo@almoayyedcomputers.com", passwordHash: password, name: "Yousif Al-Amin", role: Role.CEO },
  });
  const hr = await prisma.user.create({
    data: { cprId: "900000003", email: "hr@almoayyedcomputers.com", passwordHash: password, name: "Mariam Al-Sayed", role: Role.HR },
  });

  const hods: User[] = [];
  for (const dept of departments) {
    const hod = await prisma.user.create({
      data: {
        cprId: `9000001${departments.indexOf(dept)}`,
        email: `hod.${dept.nameEn.toLowerCase().replace(/\s+/g, "")}@almoayyedcomputers.com`,
        passwordHash: password,
        name: randomName(),
        role: Role.HOD,
        departmentId: dept.id,
      },
    });
    await prisma.department.update({ where: { id: dept.id }, data: { hodUserId: hod.id } });
    hods.push(hod);
  }

  const mentors: User[] = [];
  for (const dept of departments) {
    for (let i = 0; i < 2; i++) {
      mentors.push(
        await prisma.user.create({
          data: {
            cprId: `9000002${departments.indexOf(dept)}${i}`,
            email: `mentor${i}.${dept.nameEn.toLowerCase().replace(/\s+/g, "")}@almoayyedcomputers.com`,
            passwordHash: password,
            name: randomName(),
            role: Role.MENTOR,
            departmentId: dept.id,
          },
        })
      );
    }
  }

  // ---- applications + interns across every status ----
  let cprCounter = 100;

  async function makeApplication(status: ApplicationStatus, dept = pick(departments)) {
    const app = await prisma.shortlistApplication.create({
      data: {
        applicantName: randomName(),
        sourceDivision: pick(["Ministry of Education", "Ministry of Labour", "External Referral", UNIVERSITIES[0]]),
        trainingPeriodStart: daysAgo(60),
        trainingPeriodEnd: daysFromNow(30),
        type: pick([InternshipType.OFFLINE, InternshipType.ONLINE]),
        interestedDepartmentId: dept.id,
        status,
        interviewRemarks: status !== ApplicationStatus.SHORTLISTED ? "Strong communication skills, good technical foundation." : null,
        decidedByUserId: status !== ApplicationStatus.SHORTLISTED ? hods.find((h) => h.departmentId === dept.id)?.id : null,
        decidedAt: status !== ApplicationStatus.SHORTLISTED ? daysAgo(45) : null,
        createdByUserId: hr.id,
        createdAt: daysAgo(70),
      },
    });
    return { app, dept };
  }

  // 5 pending shortlisted (awaiting HOD decision)
  for (let i = 0; i < 5; i++) {
    await makeApplication(ApplicationStatus.SHORTLISTED);
  }
  // 2 rejected
  for (let i = 0; i < 2; i++) {
    await makeApplication(ApplicationStatus.HOD_REJECTED);
  }

  async function makeIntern(appStatus: ApplicationStatus, internStatus: InternStatus, dept = pick(departments)) {
    const { app } = await makeApplication(appStatus, dept);
    cprCounter++;
    const mentor = mentors.find((m) => m.departmentId === dept.id);
    const hod = hods.find((h) => h.departmentId === dept.id)!;

    const user = await prisma.user.create({
      data: {
        cprId: `9001${cprCounter}`,
        email: `intern${cprCounter}@students.example.com`,
        passwordHash: password,
        name: app.applicantName,
        role: Role.INTERN,
        departmentId: dept.id,
      },
    });

    const intern = await prisma.intern.create({
      data: {
        applicationId: app.id,
        userId: user.id,
        dob: daysAgo(365 * 21),
        gender: genderFromName(app.applicantName),
        mobile: `+973 ${3000 + cprCounter}${4000 + cprCounter}`,
        address: "Manama, Bahrain",
        email: user.email,
        universityName: pick(UNIVERSITIES),
        universityContact: "+973 17123456",
        studentId: `STU${10000 + cprCounter}`,
        gpa: Number((2.6 + Math.random() * 1.4).toFixed(2)),
        major: pick(MAJORS),
        yearOfStudy: pick(["3rd Year", "4th Year", "Final Year"]),
        nationalityId: pick(nationalities).id,
        doj: daysAgo(40),
        durationMonths: pick([3, 6]),
        departmentId: dept.id,
        hodUserId: hod.id,
        mentorUserId: mentor?.id,
        projectName: pick([
          "Internal Portal Modernization", "Customer Analytics Dashboard", "Digital Onboarding Revamp",
          "Inventory Automation", "Brand Refresh Campaign", "Financial Reporting Toolkit",
        ]),
        status: internStatus,
      },
    });

    await prisma.internStatusHistory.create({
      data: { internId: intern.id, toStatus: internStatus, changedByUserId: hod.id, notes: "Seeded record" },
    });

    return intern;
  }

  // 4 registered / newly confirmed current interns
  for (let i = 0; i < 4; i++) {
    await makeIntern(ApplicationStatus.HOD_APPROVED, InternStatus.REGISTERED);
  }

  // 6 active interns w/ goals + timesheets
  for (let i = 0; i < 6; i++) {
    const intern = await makeIntern(ApplicationStatus.HOD_APPROVED, InternStatus.ACTIVE);
    const goal = await prisma.goal.create({
      data: {
        internId: intern.id,
        goalType: "Project Milestone",
        title: "Complete requirements gathering",
        targetDate: daysFromNow(14),
        status: "IN_PROGRESS",
      },
    });
    const task = await prisma.task.create({
      data: { goalId: goal.id, name: "Stakeholder interviews", startDate: daysAgo(5), endDate: daysFromNow(5) },
    });
    for (let d = 5; d >= 1; d--) {
      await prisma.timesheet.create({
        data: {
          internId: intern.id,
          taskId: task.id,
          date: daysAgo(d),
          checkIn: daysAgo(d),
          checkOut: daysAgo(d),
          totalHours: 7.5,
          progressPct: Math.min(100, (6 - d) * 20),
          isLocked: true,
        },
      });
    }
    await prisma.meeting.create({ data: { internId: intern.id, type: "GOAL_SETTING", dueDate: daysAgo(35), completedAt: daysAgo(34) } });
  }

  // 5 completed (pending HR certify), with feedback submitted
  for (let i = 0; i < 5; i++) {
    const intern = await makeIntern(ApplicationStatus.HOD_APPROVED, InternStatus.COMPLETED);
    const mentor = mentors.find((m) => m.id === intern.mentorUserId)!;
    await prisma.finalRemark.create({
      data: {
        internId: intern.id,
        supervisorId: mentor.id,
        softSkillsScore: pick([3, 4, 5]),
        technicalSkillsScore: pick([3, 4, 5]),
        hireRecommended: Math.random() > 0.4,
        comments: "Consistently delivered high-quality work and integrated well with the team.",
      },
    });
    await prisma.postInternshipFeedback.create({
      data: { internId: intern.id, responsesJson: JSON.stringify(makeFeedbackResponses()) },
    });
  }

  // 6 certified (closed) interns
  for (let i = 0; i < 6; i++) {
    const intern = await makeIntern(ApplicationStatus.HOD_APPROVED, InternStatus.CERTIFIED);
    const mentor = mentors.find((m) => m.id === intern.mentorUserId)!;
    await prisma.finalRemark.create({
      data: {
        internId: intern.id,
        supervisorId: mentor.id,
        softSkillsScore: pick([4, 5]),
        technicalSkillsScore: pick([4, 5]),
        hireRecommended: true,
        comments: "Excellent performer, recommended for future opportunities.",
      },
    });
    await prisma.postInternshipFeedback.create({
      data: { internId: intern.id, responsesJson: JSON.stringify(makeFeedbackResponses()) },
    });
    await prisma.certificate.create({
      data: { internId: intern.id, certifiedByUserId: hr.id, certifiedAt: daysAgo(10), hodScorecardReviewedAt: daysAgo(12) },
    });
  }

  // university-confirmed applications awaiting HR acceptance
  for (let i = 0; i < 3; i++) {
    await makeApplication(ApplicationStatus.UNIVERSITY_CONFIRMED);
  }

  await prisma.emailNotificationSetting.createMany({
    data: [
      { eventKey: "APPLICATION_SUBMITTED", isEnabled: true },
      { eventKey: "HOD_APPROVAL", isEnabled: true },
      { eventKey: "GOAL_ASSIGNED", isEnabled: true },
      { eventKey: "MEETING_OVERDUE", isEnabled: true },
      { eventKey: "CERTIFICATE_ISSUED", isEnabled: true },
    ],
  });

  console.log("Seed complete.");
  console.log("Login with any account below + password: Passw0rd!");
  console.log(`  HR:          ${hr.cprId}`);
  console.log(`  HOD:         ${hods[0].cprId}`);
  console.log(`  Mentor:      ${mentors[0].cprId}`);
  console.log(`  CEO:         ${ceo.cprId}`);
  console.log(`  Super Admin: ${superAdmin.cprId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
