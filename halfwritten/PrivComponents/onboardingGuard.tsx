"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/user/me");

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (res.status === 404) {
          router.push("/onboarding");
          return;
        }

        if (!res.ok) {
          router.push("/");
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Checking identity...</p>
      </main>
    );
  }

  return <>{children}</>;
}