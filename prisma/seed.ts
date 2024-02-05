import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('test', 12);

  const school = await prisma.school.upsert({
    where: { name: 'Cal Poly SLO' },
    update: {},
    create: {
      name: 'Cal Poly SLO',
      address: '1 Grand Ave San Luis Obispo, CA 93407-005',
    },
  });

  const schoolId = school.id;

  const user = await prisma.user.upsert({
    where: { email: 'kcmosier@calpoly.edu' },
    update: {},
    create: {
      email: 'kcmosier@calpoly.edu',
      name: 'Kyle Mosier',
      password,
      schoolId,
    },
    include: { school: true },
  });

  const userId = user.id;

  const studyspot = await prisma.studySpot.upsert({
    where: { name: 'Kennedy Library' },
    update: {},
    create: {
      name: 'Kennedy Library',
      address: '1 Grand Ave Building 35, San Luis Obispo, CA 93401',
      schoolId,
      userId,
      latitude: '35.293289',
      longitude: '-120.653152',
      freeWifi: 'If you have a cal poly email yes',
      noiseLevel: '5th floor is quietest, 1st is loudest',
      hours: 'Hub 24 is 24 hours with a poly card',
      seatingCapacity: 'lots',
      publicRestrooms: 'yes',
      powerOutlets: 'yes',
      accessibility: 'good',
      indoorOutdoor: 'both',
      studyResources: 'printers, whiteboards, chargers, etc.',
    },
    include: { school: true },
  });

  const password2 = await hash('test', 12);
  const user2 = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'Random Student',
      password: password2,
      schoolId,
    },

    include: { school: true },
  });

  const review = await prisma.review.create({
    data: {
      content:
        'This is typically the best spot to go one campus but its currently CLOSED',
      authorId: user2.id,
      studySpotId: studyspot.id,
    },
  });

  const like = await prisma.like.create({
    data: {
      reviewId: review.id,
      studentId: user.id,
    },
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
