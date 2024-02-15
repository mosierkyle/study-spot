import Image from 'next/image';
import Link from 'next/link';
import account from '../../../public/account.png';
import styles from './page.module.css';
import type { StaticImageData } from 'next/image';

interface SignedInNavProps {
  userEmail?: string;
  //   userAvatar?: StaticImageData;
}

const SignedInNav: React.FC<SignedInNavProps> = ({ userEmail = '' }) => {
  return (
    <div className={styles.landingHeader}>
      <div className={styles.landingLogo}>
        <Link className={styles.logo} href={'/'}>
          Study<span>Spot</span>
        </Link>
      </div>
      <div className={styles.links}>
        <ul className={styles.navLinks}>
          <Link className={styles.navLink} href={'/api/auth/signout'}>
            Sign Out
          </Link>
          <p>{userEmail}</p>
          {userEmail && (
            <Image
              className={styles.navLink}
              src={account}
              alt="Account Avatar"
              width={35}
              height={35}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default SignedInNav;

// userAvatar = account,
