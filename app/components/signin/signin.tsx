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
  setshowSignup: React.Dispatch<React.SetStateAction<boolean>>;
  csrfToken?: string;
}

const SignIn: React.FC<SignInProps> = ({
  showSignin,
  setshowSignin,
  setshowSignup,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn('credentials', {
      redirect: false,
      email: data.get('email'),
      password: data.get('password'),
    });
    if (signInResponse && !signInResponse.error) {
      router.push('/');
    } else {
      console.log('Error: ', signInResponse?.error);
      setError('Incorrect Email or Password!');
    }
    setIsLoading(false);
  };

  const handleShowSignin = () => {
    showSignin ? setshowSignin(false) : setshowSignin(true);
  };

  const handleSignUp = () => {
    setshowSignin(false);
    setshowSignup(true);
  };

  return (
    <div className={styles.formDiv}>
      <div onClick={handleShowSignin} className={styles.overlay}></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Image
          onClick={handleShowSignin}
          className={styles.x}
          src={x}
          alt="X"
          height={25}
          width={25}
        />
        <p className={styles.heading}>Login</p>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <p className={styles.text}>
            Find the perfect place to study and help others do the same
          </p>
        )}
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
          <button type="submit" className={styles.submit}>
            Continue with Email
          </button>
          <p className={styles.already}>
            Dont have an account?
            <a onClick={handleSignUp} className={styles.alreadyLink}>
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
