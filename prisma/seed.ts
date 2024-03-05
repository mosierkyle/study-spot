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
      latitude: '35.300390',
      longitude: '-120.658100',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Washington' },
    update: {},
    create: {
      name: 'Univeristy of Washington',
      city: 'Seattle',
      address: '1410 NE Campus Pkwy, Seattle, WA 98195',
      latitude: '47.656601',
      longitude: '-122.312828',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Washington' },
    update: {},
    create: {
      name: 'Univeristy of Washington',
      city: 'Pullman',
      address: '1500 Glenn Terrell Mall Pullman, WA  99163 United States',
      latitude: '46.720460',
      longitude: '-117.166250',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Univeristy of Arizona' },
    update: {},
    create: {
      name: 'Univeristy of Arizona',
      city: 'Tucson',
      address: '1200 E University Blvd, Tucson, AZ 85721',
      latitude: '32.231899',
      longitude: '-110.953529',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Boise State University' },
    update: {},
    create: {
      name: 'Boise State University',
      city: 'Boise',
      address: '1910 W University Dr, Boise, ID 83725',
      latitude: '43.600979',
      longitude: '-116.197342',
    },
  });

  await prisma.school.upsert({
    where: { name: 'UCLA' },
    update: {},
    create: {
      name: 'UCLA',
      city: 'Los Angeles',
      address: '617 Charles E Young Dr S, Los Angeles, CA 90095',
      latitude: '34.0669908',
      longitude: '-118.4457698',
    },
  });

  await prisma.school.upsert({
    where: { name: 'Oregon State University' },
    update: {},
    create: {
      name: 'Oregon State University',
      city: 'Corvallis',
      address: '1500 SW Jefferson Way, Corvallis, OR 97331',
      latitude: '44.5630559',
      longitude: '-123.2839236',
    },
  });

  await prisma.school.upsert({
    where: { name: 'San Diego State University' },
    update: {},
    create: {
      name: 'San Diego State University',
      city: 'San Diego',
      address: '5500 Campanile Dr, San Diego, CA 92182',
      latitude: '32.7729919',
      longitude: '-117.0736735',
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
      wifi: true,
      noiseLevel: 'Quiet',
      rating: 4.5,
      onCampus: true,
      hour24: true,
      seating: 'lots',
      restrooms: true,
      studyResources: ['printers', 'whiteboards', 'chargers'],
    },
    include: { school: true },
  });

  const studyspot2 = await prisma.studySpot.upsert({
    where: { name: 'Baker Science' },
    update: {},
    create: {
      name: 'Baker Science',
      address: 'Baker Science San Luis Obispo, CA 93407',
      description:
        'Baker science building, located at the center of campus, Many different study locations here.',
      schoolId,
      userId,
      latitude: '35.300460',
      longitude: '-120.658110',
      wifi: true,
      noiseLevel: 'Varies',
      rating: 4.0,
      onCampus: true,
      hour24: false,
      seating: 'some',
      restrooms: true,
      studyResources: ['chargers'],
    },
    include: { school: true },
  });

  const studyspot3 = await prisma.studySpot.upsert({
    where: { name: 'BUS Lab' },
    update: {},
    create: {
      name: 'BUS Lab',
      address: '1 Grand Avenue Building 3. San Luis Obispo, CA 93407',
      description:
        'This is the Business building study room located on the third floor',
      schoolId,
      userId,
      latitude: '35.3',
      longitude: '-120.66505',
      wifi: true,
      noiseLevel: 'Varies',
      rating: 5.0,
      onCampus: true,
      hour24: false,
      seating: 'lots',
      restrooms: true,
      studyResources: ['printers', 'whiteboards', 'chargers'],
    },
    include: { school: true },
  });

  const studyspot4 = await prisma.studySpot.upsert({
    where: { name: 'University Union' },
    update: {},
    create: {
      name: 'Universiy Union',
      address: 'S Poly View Dr, San Luis Obispo, CA 93405',
      description: 'The lobby area of the university union building',
      schoolId,
      userId,
      latitude: '35.30001',
      longitude: ' -120.65869',
      wifi: true,
      noiseLevel: 'Loud',
      rating: 3.5,
      onCampus: true,
      hour24: false,
      seating: 'some',
      restrooms: true,
      studyResources: ['chargers'],
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
      rating: 4,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      content:
        'While the BUS Lab boasts a convenient location and basic amenities, such as high-speed Wi-Fi and comfortable seating, it falls short in several areas. The ambiance lacks character and fails to inspire creativity or deep focus. The refreshment corner, while present, offers limited options and lacks variety. Additionally, the collaborative atmosphere touted by the establishment feels forced and artificial, with interactions often feeling superficial rather than genuine. Overall, while the BUS Lab serves its purpose as a functional study spot, it lacks the charm and depth needed to truly elevate the academic experience.',
      authorId: user2.id,
      studySpotId: studyspot3.id,
      rating: 5,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      content:
        'While some may find the BUS Lab to be a convenient study spot with its central location and basic amenities, my experience left much to be desired. The lackluster ambiance fails to foster a productive or enjoyable study environment, and the limited refreshment options hardly suffice for a long study session. Despite attempts to cultivate a collaborative atmosphere, interactions often feel forced and insincere, detracting from the overall experience. In essence, while the BUS Lab may serve its purpose for some, it ultimately falls short in providing a truly engaging and fulfilling study environment.',
      authorId: user.id,
      studySpotId: studyspot3.id,
      rating: 4,
    },
  });

  // const like = await prisma.like.create({
  //   data: {
  //     reviewId: review.id,
  //     studentId: user.id,
  //   },
  // });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
