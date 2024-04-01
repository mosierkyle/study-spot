'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import x from '../../../public/x.png';
import back from '../../../public/back.png';
import Image from 'next/image';
import Link from 'next/link';

interface SignupEmailProps {
  showSignupEmail: boolean;
  setshowSignupEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setshowSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setshowSingIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupEmail: React.FC<SignupEmailProps> = ({
  showSignupEmail,
  setshowSignupEmail,
  setshowSignup,
  setshowSingIn,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const signInResponse = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        console.log(signInResponse?.error);
        console.log('signed in');
        if (signInResponse && !signInResponse.error) {
          router.push('/');
          window.location.reload();
        }
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      setError(`${error}`);
    }
  };

  const handleShowSignin = () => {
    showSignupEmail ? setshowSignupEmail(false) : setshowSignupEmail(true);
  };

  const goBack = () => {
    setshowSignupEmail(false);
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
        <Image
          onClick={goBack}
          className={styles.back}
          src={back}
          alt="X"
          height={29}
          width={29}
        />
        <p className={styles.heading}>Sign up with Email</p>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <p className={styles.text}>
            Find the perfect place to study and help others do the same
          </p>
        )}
        <div className={styles.formElements}>
          <div className={styles.topInputs}>
            <div className={styles.smallInputs}>
              <div className={styles.passwordForgot}>
                <label className={styles.label}>Name</label>
              </div>
              <input
                type="name"
                name="name"
                required
                className={styles.inputSmall}
              />
            </div>
            <div className={styles.smallInputs}>
              <div className={styles.passwordForgot}>
                <label className={styles.label}>Email</label>
              </div>
              <input
                type="email"
                name="email"
                // placeholder="Email"
                required
                className={styles.inputSmall}
              />
            </div>
          </div>
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
            Already have an account?
            <span
              onClick={() => {
                setshowSingIn(true);
                setshowSignupEmail(false);
              }}
              className={styles.alreadyLink}
            >
              Sign in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupEmail;
