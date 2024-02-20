import { prisma } from '@/lib/prisma';
import type { Prisma, StudySpot } from '@prisma/client';
import { hash } from 'bcrypt';
import getLatLong from './getLatLong';

// const [formPage, setFormPage] = useState<number>(1);
//   const [name, setName] = useState<string>('');
//   const [address, setAddress] = useState<string>('');
//   const [photos, setPhotos] = useState<File[]>([]);
//   const [wifi, setWifi] = useState<string>('');
//   const [noiseLevel, setNoiseLevel] = useState<string>('');
//   const [seating, setSeating] = useState<string>('');
//   const [hours, setHours] = useState<string>('');
//   const [restrooms, setRestrooms] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [resources, setResources] = useState<string[]>([]);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [photoURLs, setPhotoURLs] = useState<string[]>([]);

interface CreateSpotProps {
  name: string;
  description: string;
  address: string;
  photos?: string[];
  wifi: string;
  noiseLevel: string;
  seating: string;
  hours?: string;
  restrooms: string;
  resources?: string[];
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
    noiseLevel,
    seating,
    hours,
    restrooms,
    resources,
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
      schoolId,
      userId,
      latitude: location[1],
      longitude: location[0],
      wifi: wifi,
      noiseLevel: noiseLevel,
      hours: hours,
      seating: seating,
      restrooms: restrooms,
      studyResources: resources,
    },
  });
  console.log(studyspot);
  return studyspot;
};

export default createSpot;
