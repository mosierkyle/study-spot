import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const useCheckSignIn = () => {
  const { data: session, status } = useSession();
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setIsSignedIn(null);
    } else {
      setIsSignedIn(!!session);
    }
  }, [session, status]);
  console.log(session);
  return isSignedIn;
};

export default useCheckSignIn;
