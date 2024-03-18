import styles from './page.module.css';

const Loading = () => {
  const loadingCount = [1, 2, 3];

  return (
    <>
      {loadingCount.map((count) => {
        return (
          <div
            key={`loadingSkeleton: ${count}`}
            className={styles.reviewSkeleton}
          >
            <div className={styles.userSkeleton}>
              <div className={styles.imageSkeleton}></div>
              <div className={styles.userSectionSkeleton}>
                <div className={styles.nameSkeleton}></div>
                <div className={styles.timeSkeleton}></div>
              </div>
            </div>
            <div className={styles.starsSkeleton}></div>
            <div className={styles.contentSkeleton}></div>
            <div className={styles.contentSkeleton}></div>
            <div className={styles.contentSkeleton}></div>
            <div className={styles.contentSkeletonLast}></div>
          </div>
        );
      })}
    </>
  );
};

export default Loading;
