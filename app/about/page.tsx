// import { School } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const About = async () => {
  //   const feed = await prisma.school.findMany();
  return (
    <div>
      <h1>About Page</h1>
      {/* {feed.map((school: School) => {
        return <p key={school.id}>{school.name}</p>;
      })} */}
    </div>
  );
};

export default About;
