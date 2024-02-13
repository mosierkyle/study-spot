import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';

interface Props {
  params: {
    studyspot: string;
  };
}
export async function generateMetadata({ params: { studyspot } }: Props) {
  const schoolData: School | undefined = await getSchool(studyspot);

  const displayTerm = schoolData?.name.replaceAll('%20', ' ');

  return {
    title: displayTerm,
    description: `Search Results for ${displayTerm}`,
  };
}

const School = async ({ params: { studyspot } }: Props) => {
  console.log(studyspot);
  const schoolData: School | undefined = await getSchool(studyspot);
  console.log(schoolData);

  return (
    <div className="main">
      <h1 className="header">{schoolData?.name}</h1>
    </div>
  );
};

export default School;
