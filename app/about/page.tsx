import { getSchool } from '@/lib/getSchool';
import type { Prisma, School } from '@prisma/client';
import { error } from 'console';
import getLatLong from '@/lib/getLatLong';
// import storePhotos from '@/lib/storePhotos';

const About = async () => {
  const location = await getLatLong('2134 Santa Ynez Ave San Luis Obispo');

  return (
    <div>
      <h1>About Page</h1>
      <p>{`${location[1]}, ${location[0]}`}</p>
    </div>
  );
};

export default About;
