'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import x from '../../public/x.png';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      router.push('/');
    } else {
      console.log('Error: ', signInResponse);
      setError('Your Email or Password is wrong!');
    }
  };

  return (
    <div className={styles.formDiv}>
      <div className={styles.overlay}></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <span className={styles.error}>{error}</span>}
        <Image className={styles.x} src={x} alt="X" height={25} width={25} />
        <p className={styles.heading}>Sign In</p>
        <p className={styles.text}>
          Find the perfect place to study and help others do the same
        </p>
        <div className={styles.dividerDiv}>
          <hr className={styles.divider} data-content="or sign in with email" />
        </div>
        <div className={styles.formElements}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className={styles.input}
          />

          <button type="submit" className={styles.submit}>
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
