'use client';

import Image from 'next/image';
import googleLogo from '@/public/google.png';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';

export default function GoogleSignInButton() {
  const handleClick = () => {
    signIn('google');
  };

  return (
    <button type="button" onClick={handleClick} className={styles.google}>
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <span className={styles.googleText}>Continue with Google</span>
    </button>
  );
}
