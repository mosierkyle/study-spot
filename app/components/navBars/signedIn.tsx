'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import type { StaticImageData } from 'next/image';
import user2 from '../../../public/user2.png';
import { useState } from 'react';
import account from '../../../public/account3.png';
import logout from '../../../public/logout.png';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface SignedInNavProps {
  userEmail?: string;
  userAvatar?: string;
}

const SignedInNav: React.FC<SignedInNavProps> = ({
  userEmail = '',
  userAvatar,
}) => {
  const [profileOptions, setProfileOptions] = useState<boolean>(false);
  const router = useRouter();

  const handleProfileOptions = () => {
    profileOptions ? setProfileOptions(false) : setProfileOptions(true);
  };

  return (
    <div className={styles.landingHeader}>
      {profileOptions && (
        <div
          onClick={() => {
            console.log('we here');
            profileOptions && handleProfileOptions();
          }}
          className={styles.profileOverlay}
        >
          <div className={styles.profileOptions}>
            <Link className={styles.profileOption} href={'/account'}>
              <Image alt="profile" height={24} width={24} src={account}></Image>
              Profile
            </Link>
            <div
              className={styles.profileOption}
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
            >
              <Image alt="logout" height={24} width={24} src={logout}></Image>
              Log Out
            </div>
          </div>
        </div>
      )}

      <div className={styles.landingLogo}>
        <Link className={styles.logo} href={'/'}>
          Study<span>Spot</span>
        </Link>
      </div>
      <div className={styles.links}>
        <ul className={styles.navLinks}>
          {/* <Link className={styles.navLink} href={'/api/auth/signout'}>
            Sign Out
          </Link> */}
          <p>{userEmail}</p>

          {userEmail && (
            <div onClick={handleProfileOptions}>
              <Image
                className={styles.profilePic}
                src={userAvatar ? userAvatar : user2}
                alt="Account Avatar"
                width={35}
                height={35}
              />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SignedInNav;

// userAvatar = account,
