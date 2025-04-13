"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export type ClientClerkWrapperProps = {
  userId: string | null;
};

export default function ClientClerkWrapper({ userId }: ClientClerkWrapperProps) {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton forceRedirectUrl="/" />
        <SignUpButton forceRedirectUrl="/" />
      </SignedOut>
      <SignedIn>
        <span>{userId}</span>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}
