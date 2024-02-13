import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';

interface Props {
  params: {
    schoolName: string;
  };
}

const School = async ({ params: { schoolName } }: Props) => {
  console.log(schoolName);
  const schoolData: School | null = await getSchool(schoolName);
  console.log('we out here');

  return (
    <div className="main">
      <h1 className="header">{schoolData?.name}</h1>
    </div>
  );
};

export default School;
