'use client';

import { Providers } from '../../providers';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SignIn from '../../components/signin/signin';

const SignedOutNav = () => {
  const [showSignin, setshowSignin] = useState<boolean>(false);

  const handleShowSignin = () => {
    showSignin ? setshowSignin(false) : setshowSignin(true);
  };
  return (
    <div className={styles.landingHeader}>
      <div className={styles.landingLogo}>
        <p>
          Study<span>Spot</span>
        </p>
      </div>
      <div className={styles.links}>
        <ul className={styles.navLinks}>
          {/* <li className={styles.navLink}>Search</li> */}
          <li onClick={handleShowSignin} className={styles.navLink}>
            Login
          </li>
          {showSignin && (
            <SignIn setshowSignin={setshowSignin} showSignin={showSignin} />
          )}
          <Link href="api/auth/signin" className={styles.signUp}>
            Sign up
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SignedOutNav;
