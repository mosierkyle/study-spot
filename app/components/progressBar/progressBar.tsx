import styles from './page.module.css';

type ProgressBarProps = {
  formPage: Number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ formPage }) => {
  return (
    <div className={styles.content}>
      <div className={styles.number}>1</div>
      <div
        className={
          formPage == 2 || formPage == 3 ? styles.bar : styles.beforeBar
        }
      ></div>
      <div
        className={
          formPage == 2 || formPage == 3 ? styles.number : styles.beforeNumber
        }
      >
        2
      </div>
      <div className={formPage == 3 ? styles.bar : styles.beforeBar}></div>
      <div className={formPage == 3 ? styles.number : styles.beforeNumber}>
        3
      </div>
    </div>
  );
};

export default ProgressBar;
