import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;

  if (!adminEmail) {
    console.log("INITIAL_ADMIN_EMAIL not set, skipping admin seed");
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user ${adminEmail} already exists`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin",
      emailVerified: new Date(),
    },
  });

  console.log(`Admin user created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
