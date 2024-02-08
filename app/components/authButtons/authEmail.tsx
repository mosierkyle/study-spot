'use client';

import { signIn } from 'next-auth/react';
import styles from './page.module.css';

export default function CredentialsSignInButton() {
  const handleClick = () => {
    signIn();
  };

  return (
    <button onClick={handleClick} className={styles.email}>
      <span className={styles.emailText}>Continue with Email</span>
    </button>
  );
}
