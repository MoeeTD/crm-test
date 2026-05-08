import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  console.log("Cleared.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
