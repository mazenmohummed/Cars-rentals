import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
 await prisma.user.update({
  where: {
    email: "mazn39998@gmail.com"
  },
  data: {
    role: "ADMIN" // Or whatever your Enum/String value is
  }
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
  }); // <--- CHECK IF THIS IS MISSING