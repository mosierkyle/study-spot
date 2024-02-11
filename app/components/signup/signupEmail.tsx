'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import x from '../../../public/x.png';
import back from '../../../public/back.png';
import Image from 'next/image';
import Link from 'next/link';
import createUser from '@/lib/createUser';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

interface SignupEmailProps {
  showSignupEmail: boolean;
  setshowSignupEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setshowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupEmail: React.FC<SignupEmailProps> = ({
  showSignupEmail,
  setshowSignupEmail,
  setshowSignup,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(name, email, password);
    // try {
    // Create the user
    await createUser({ email, name, password });
    // Sign in the user after successful creation
    const signInResponse = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInResponse?.error) {
      throw new Error('Failed to sign in user');
    }

    // Redirect the user to the home page
    router.push('/');
    // } catch (error) {
    //   console.error('Error creating user:', error);
    //   setError('Failed to create user');
    // }
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
        {error && <span className={styles.error}>{error}</span>}
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
        <p className={styles.text}>
          Find the perfect place to study and help others do the same
        </p>
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

export default SignupEmail;
