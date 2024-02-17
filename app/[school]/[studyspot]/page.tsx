import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';
import styles from './page.module.css';

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

const StudySpot = async ({ params: { studyspot } }: Props) => {
  console.log(studyspot);
  const schoolData: School | undefined = await getSchool(studyspot);
  console.log(schoolData);

  return (
    <div className={styles.main}>
      <h1 className={styles.header}>{schoolData?.name}</h1>
    </div>
  );
};

export default StudySpot;
