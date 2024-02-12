import { getSchool } from '@/lib/getSchool';
import type { Prisma, School } from '@prisma/client';
import { error } from 'console';

const About = async () => {
  const calpoly: School | null = await getSchool('Cal Poly SLO');
  if (!calpoly) {
    return (
      <div>
        <h1>About Page</h1>
        <p>Cal Poly SLO not found</p>
      </div>
    );
  }
  return (
    <div>
      <h1>About Page</h1>
      <p>{calpoly.address}</p>
    </div>
  );
};

export default About;
