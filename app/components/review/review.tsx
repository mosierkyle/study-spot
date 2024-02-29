import { Review } from '@prisma/client';

interface reviewCardProps {
  reviewData: Review | null;
}

const ReviewCard: React.FC<reviewCardProps> = ({ reviewData }) => {
  return (
    <div>
      <p></p>
    </div>
  );
};

export default ReviewCard;
