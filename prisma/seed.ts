import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: "admin-access",
      },
    ],
  });

  await prisma.role.create({
    data: {
      name: "super-admin",
      permissions: {
        connect: {
          name: "admin-access",
        },
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        connect: {
          name: "admin-access",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "super.admin@admin.com",
      password: bcrypt.hashSync("password", 10),
      name: "Super Admin",
      roles: {
        connectOrCreate: {
          create: {
            name: "super-admin",
          },
          where: {
            name: "super-admin",
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: bcrypt.hashSync("password", 10),
      name: "Admin",
      roles: {
        connectOrCreate: {
          create: {
            name: "admin",
          },
          where: {
            name: "admin",
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
