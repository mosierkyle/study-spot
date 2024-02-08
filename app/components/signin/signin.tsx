'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import x from '../../../public/x.png';
import Image from 'next/image';
import CredentialsSignInButton from '../authButtons/authEmail';
import GoogleSignInButton from '../authButtons/authGoogle';
import Link from 'next/link';

interface SignInProps {
  showSignin: boolean;
  setshowSignin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ showSignin, setshowSignin }) => {
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

  const handleShowSignin = () => {
    showSignin ? setshowSignin(false) : setshowSignin(true);
  };

  return (
    <div className={styles.formDiv}>
      <div onClick={handleShowSignin} className={styles.overlay}></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <span className={styles.error}>{error}</span>}
        <Image
          onClick={handleShowSignin}
          className={styles.x}
          src={x}
          alt="X"
          height={25}
          width={25}
        />
        <p className={styles.heading}>Login</p>
        <p className={styles.text}>
          Find the perfect place to study and help others do the same
        </p>
        <GoogleSignInButton />
        <div className={styles.dividerDiv}>
          <hr className={styles.divider} data-content="or sign in with email" />
        </div>
        <div className={styles.formElements}>
          <div className={styles.passwordForgot}>
            <label className={styles.label}>Email</label>
          </div>
          <input
            type="email"
            name="email"
            // placeholder="Email"
            required
            className={styles.input}
          />
          <div className={styles.passwordForgot}>
            <label className={styles.label}>Password</label>
            <p className={styles.forgot}>Forgot?</p>
          </div>
          <input
            type="password"
            name="password"
            // placeholder="Password"
            required
            className={styles.input}
          />

          {/* <button type="submit" className={styles.submit}>
            Log in
          </button> */}
          <CredentialsSignInButton />
          <p className={styles.already}>
            Dont have an account?
            <Link href="signup" className={styles.alreadyLink}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
