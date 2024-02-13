import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';

interface Props {
  params: {
    school: string;
  };
}
export async function generateMetadata({ params: { school } }: Props) {
  const schoolData: School | undefined = await getSchool(school);

  const displayTerm = schoolData?.name.replaceAll('%20', ' ');

  return {
    title: displayTerm,
    description: `Search Results for ${displayTerm}`,
  };
}

const School = async ({ params: { school } }: Props) => {
  console.log(school);
  const schoolData: School | undefined = await getSchool(school);
  console.log(schoolData);

  return (
    <div className="main">
      <h1 className="header">{schoolData?.name}</h1>
    </div>
  );
};

export default School;
