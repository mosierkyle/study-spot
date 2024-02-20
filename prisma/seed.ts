import { prisma } from '../lib/prisma';
import { hash } from 'bcrypt';

async function main() {
  const school = await prisma.school.upsert({
    where: { name: 'Cal Poly San Luis Obispo' },
    update: {},
    create: {
      name: 'Cal Poly San Luis Obispo',
      city: 'San Luis Obispo',
      address: '1 Grand Ave San Luis Obispo, CA 93407-005',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Washington' },
    update: {},
    create: {
      name: 'Univeristy of Washington',
      city: 'Seattle',
      address: '1410 NE Campus Pkwy, Seattle, WA 98195',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Washington' },
    update: {},
    create: {
      name: 'Univeristy of Washington',
      city: 'Pullman',
      address: '1500 Glenn Terrell Mall Pullman, WA  99163 United States',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Arizona' },
    update: {},
    create: {
      name: 'Univeristy of Arizona',
      city: 'Tucson',
      address: '1200 E University Blvd, Tucson, AZ 85721',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Boise State University' },
    update: {},
    create: {
      name: 'Boise State University',
      city: 'Boise',
      address: '1910 W University Dr, Boise, ID 83725',
    },
  });

  await prisma.school.upsert({
    where: { name: 'UCLA' },
    update: {},
    create: {
      name: 'UCLA',
      city: 'Los Angeles',
      address: '617 Charles E Young Dr S, Los Angeles, CA 90095',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Oregon State University' },
    update: {},
    create: {
      name: 'Oregon State University',
      city: 'Corvallis',
      address: '1500 SW Jefferson Way, Corvallis, OR 97331',
    },
  });

  await prisma.school.upsert({
    where: { name: 'San Diego State University' },
    update: {},
    create: {
      name: 'San Diego State University',
      city: 'San Diego',
      address: '5500 Campanile Dr, San Diego, CA 92182',
    },
  });

  const schoolId = await school.id;

  const password = await hash('test', 12);
  const user = await prisma.user.upsert({
    where: { email: 'kcmosier@calpoly.edu' },
    update: {},
    create: {
      email: 'kcmosier@calpoly.edu',
      name: 'Kyle Mosier',
      password,
      schoolId: schoolId,
    },
  });

  const userId = user.id;

  const studyspot = await prisma.studySpot.upsert({
    where: { name: 'Kennedy Library' },
    update: {},
    create: {
      name: 'Kennedy Library',
      address: '1 Grand Ave Building 35, San Luis Obispo, CA 93401',
      description:
        'This is the primary library on campus, it has 5 floors and a 24 hub.',
      schoolId,
      userId,
      latitude: '35.293289',
      longitude: '-120.653152',
      wifi: 'If you have a cal poly email yes',
      noiseLevel: '5th floor is quietest, 1st is loudest',
      hours: 'Hub 24 is 24 hours with a poly card',
      seating: 'lots',
      restrooms: 'yes',
      studyResources: ['printers', 'whiteboards', 'chargers', 'etc.'],
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
      schoolId: schoolId,
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
