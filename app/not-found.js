import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import styles from './page.module.css';
import error from '../public/error.jpg';

const NotFound = () => {
  return (
    <main className={styles.notFound}>
      <Image className={styles.notFoundImage} src={error} alt="404" />
      <p className={styles.notFoundHeader}>Oops..</p>
      <p className={styles.notFoundText}>
        It looks like the page you tried to access does not exist. Click the
        button below to go back to the home page
      </p>
      <Link className={styles.notFoundButton} href={'/'}>
        Homepage
      </Link>
    </main>
  );
};

export default NotFound;
