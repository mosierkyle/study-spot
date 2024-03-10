import { prisma } from '@/lib/prisma';
import type { StudySpot } from '@prisma/client';
import getLatLong from './getLatLong';

interface CreateSpotProps {
  name: string;
  description: string;
  address: string;
  photos?: string[];
  wifi: boolean;
  noiseLevel: string;
  seating: string;
  hour24?: boolean;
  restrooms: boolean;
  rating?: number;
  onCampus?: boolean;
  studyResources?: string[];
  schoolId: string;
  userId: string;
}

const createSpot = async (props: CreateSpotProps): Promise<StudySpot> => {
  const {
    name,
    description,
    address,
    photos,
    wifi,
    hour24,
    restrooms,
    rating,
    onCampus,
    studyResources,
    schoolId,
    userId,
  } = props;

  const location = await getLatLong(address);

  const existingSpot = await prisma.studySpot.findUnique({
    where: {
      name: name,
    },
  });
  if (existingSpot) {
    throw new Error('A study spot already exists with this name');
  }

  const studyspot = await prisma.studySpot.upsert({
    where: { name: name },
    update: {},
    create: {
      name: name,
      address: address,
      description: description,
      schoolId: schoolId,
      userId: userId,
      latitude: location[1],
      longitude: location[0],
      photos: photos ?? [],
      wifi: wifi,
      hour24: hour24 ?? false,
      restrooms: restrooms,
      rating: rating ?? 0,
      onCampus: onCampus ?? true,
      studyResources: studyResources ?? [],
    },
  });
  console.log(studyspot);
  return studyspot;
};

export default createSpot;
