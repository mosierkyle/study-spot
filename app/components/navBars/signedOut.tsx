'use client';

import { Providers } from '../../providers';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SignIn from '../signin/signin';
import Signup from '../signup/signup';
import SignupEmail from '../signup/signupEmail';

const SignedOutNav = () => {
  const [showSignin, setshowSignin] = useState<boolean>(false);
  const [showSignup, setshowSignup] = useState<boolean>(false);
  const [showSignupEmail, setshowSignupEmail] = useState<boolean>(false);

  const handleShowSignin = () => {
    showSignin ? setshowSignin(false) : setshowSignin(true);
  };

  const handleShowSignup = () => {
    showSignin ? setshowSignup(false) : setshowSignup(true);
  };

  const handleShowSignupEmail = () => {
    showSignin ? setshowSignupEmail(false) : setshowSignupEmail(true);
  };

  return (
    <div className={styles.landingHeader}>
      <div className={styles.landingLogo}>
        <Link className={styles.logo} href={'/'}>
          Study<span>Spot</span>
        </Link>
      </div>
      <div className={styles.links}>
        <ul className={styles.navLinks}>
          {/* <li className={styles.navLink}>Search</li> */}
          <li onClick={handleShowSignin} className={styles.navLink}>
            Login
          </li>
          {showSignin && (
            <SignIn
              setshowSignup={setshowSignup}
              setshowSignin={setshowSignin}
              showSignin={showSignin}
            />
          )}
          <li onClick={handleShowSignup} className={styles.signUp}>
            Sign up
          </li>
          {showSignup && (
            <Signup
              setshowSignin={setshowSignin}
              showSignin={showSignin}
              setshowSignup={setshowSignup}
              showSignup={showSignup}
              setshowSignupEmail={setshowSignupEmail}
              showSignupEmail={showSignupEmail}
            />
          )}
          {showSignupEmail && (
            <SignupEmail
              setshowSignupEmail={setshowSignupEmail}
              showSignupEmail={showSignupEmail}
              setshowSignup={setshowSignup}
              setshowSingIn={setshowSignin}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default SignedOutNav;
