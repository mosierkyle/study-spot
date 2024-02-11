import { getSchool } from '@/lib/getSchool';

const About = async () => {
  const calpoly = await getSchool('Cal Poly SLO');

  return (
    <div>
      <h1>About Page</h1>
      <p>{calpoly.address}</p>
    </div>
  );
};

export default About;
