import styles from './page.module.css';

const Loading = () => {
  const loadingCount = [1, 2, 3];

  return (
    <>
      {loadingCount.map((count) => {
        return (
          <div
            key={`loadingSkeletonSpot: ${count}`}
            className={styles.reviewSkeleton}
          >
            <div className={styles.skeletonPhoto}></div>
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonName}></div>

              <div className={styles.skeletonRating}></div>
              <div className={styles.skeletonReviews}></div>
              <div className={styles.skeletonAddress}></div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Loading;
