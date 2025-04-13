'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/email");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null; // Prevent rendering SignInButton when signed in

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/landing_bg.png')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center justify-center gap-3 mb-3">
          <Image src="/logo.png" alt="Logo" width={300} height={300} />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Welcome to ZeroG Inbox!</h2>
        <p className="text-gray-700 mb-6">
          Adrift in a galaxy of unread messages? <br />
          ZeroG Inbox steers you toward inbox clarity — one card at a time.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full text-lg">Sign In</Button>
        </SignInButton>
      </div>
    </div>
  );
}
