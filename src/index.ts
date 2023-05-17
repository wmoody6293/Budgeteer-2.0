import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'william.m.moody@outlook.com',
      password: 'Porkchop6293?',
      firstName: 'Will',
      lastName: 'Moody',
      monthlyBudget: 8000,
    },
  });
  console.log('this is the created User: ');
  const newUser = await prisma.user.findUnique({
    where: {
      email: 'william.m.moody@outlook.com',
    },
  });
  console.log(newUser);
  if (newUser !== null && newUser.id !== null) {
    await prisma.expense.create({
      data: {
        category: 'grocery',
        date: '05/01/2023',
        amount: '125.00',
        userId: newUser.id,
      },
    });
  }
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
