import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CPR_ID = "900000001";
const PASSWORD = "Admin@2026!";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { cprId: CPR_ID },
    update: {},
    create: {
      cprId: CPR_ID,
      email: "admin@almoayyedcomputers.com",
      passwordHash,
      name: "System Administrator",
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("Super Admin ready:");
  console.log(`  cprId:    ${admin.cprId}`);
  console.log(`  password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
