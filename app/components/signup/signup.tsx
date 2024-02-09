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
import SignupEmail from './signupEmail';

interface SignupProps {
  showSignup: boolean;
  setshowSignup: React.Dispatch<React.SetStateAction<boolean>>;
  showSignupEmail: boolean;
  setshowSignupEmail: React.Dispatch<React.SetStateAction<boolean>>;
  showSignin: boolean;
  setshowSignin: React.Dispatch<React.SetStateAction<boolean>>;
  csrfToken?: string;
}

const Signup: React.FC<SignupProps> = ({
  showSignup,
  setshowSignup,
  setshowSignupEmail,
  setshowSignin,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
    });

    if (signInResponse && !signInResponse.error) {
      router.push('/');
    } else {
      console.log('Error: ', signInResponse);
      setError('Your Email or Password is wrong!');
    }
  };

  const handleShowSignin = () => {
    showSignup ? setshowSignup(false) : setshowSignup(true);
  };

  const handleEmail = () => {
    setshowSignup(false);
    setshowSignupEmail(true);
  };

  const handleSignIn = () => {
    setshowSignup(false);
    setshowSignin(true);
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
        <p className={styles.heading}>Sign Up</p>
        <p className={styles.text}>
          Find the perfect place to study and help others do the same
        </p>
        <GoogleSignInButton />
        <div className={styles.dividerDiv}>
          <hr className={styles.divider} data-content="or sign up with email" />
        </div>
        <button onClick={handleEmail} type="submit" className={styles.submit}>
          Continue with Email
        </button>
        <p className={styles.terms}>
          By creating an account you agree with our Terms of Service, Privacy
          Policy, and our default Notification Settings.
        </p>
        <p className={styles.already}>
          Already have an account?
          <a onClick={handleSignIn} className={styles.alreadyLink}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
