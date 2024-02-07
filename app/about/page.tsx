import { getSchool, createUser } from '@/lib/userManipulation';

const About = async () => {
  const calpoly = await getSchool('Cal Poly SLO');
  createUser({
    email: 'jondoe@email.com',
    name: 'Jon Doe',
    avatar: undefined,
    password: 'test123',
    schoolName: 'Cal Poly SLO',
  });

  return (
    <div>
      <h1>About Page</h1>
      <p>{calpoly.address}</p>
    </div>
  );
};

export default About;
