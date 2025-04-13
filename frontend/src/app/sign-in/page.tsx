'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/email'); // Redirect authenticated users
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null; // Prevent rendering SignIn component

  return <SignIn />;
}
