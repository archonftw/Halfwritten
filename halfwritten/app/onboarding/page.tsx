"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const [anonymousName, setAnonymousName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
  if (!isLoaded) return;

  if (!isSignedIn) {
    router.push("/sign-in");
    return;
  }

  const checkExistingUser = async () => {
    try {
      const res = await fetch("/api/user/me");

      if (res.ok) {
        router.push("/profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkExistingUser();
}, [isLoaded, isSignedIn, router]);

  const usernameError = useMemo(() => {
    if (!anonymousName) return "";
    if (!USERNAME_REGEX.test(anonymousName)) {
      return "Use 3–20 chars: lowercase letters, numbers, underscores only.";
    }
    return "";
  }, [anonymousName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedName = anonymousName.trim().toLowerCase();

    if (!cleanedName) {
      toast.error("Anonymous name is required.");
      return;
    }

    if (!USERNAME_REGEX.test(cleanedName)) {
      toast.error(
        "Username must be 3–20 chars with lowercase letters, numbers, and underscores only."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anonymousName: cleanedName,
          bio: bio.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to complete onboarding.");
        return;
      }

      toast.success("Welcome to HalfWritten ✍️");

      // Give toast a tiny moment before redirect
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Loading your silence...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center">
      <Toaster position="top-center" />

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <p className="text-sm tracking-[0.25em] uppercase text-zinc-500">
            HalfWritten
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Become
            <span className="block text-zinc-400">someone unseen.</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg max-w-md leading-relaxed">
            Here, your real identity stays outside. Choose a name that carries
            your words — not your face.
          </p>

          <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/60 backdrop-blur-sm max-w-md">
            <p className="text-sm text-zinc-500 mb-2">Signed in as</p>
            <p className="text-zinc-200 font-medium">
              {user?.primaryEmailAddress?.emailAddress || "Clerk user"}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              This won’t be shown publicly.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                Anonymous Onboarding
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-2">
                Choose your pen name
              </h2>
              <p className="text-zinc-400 mt-2 text-sm">
                This is how others will know you on HalfWritten.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Anonymous Name */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Anonymous Name
                </label>
                <input
                  type="text"
                  value={anonymousName}
                  onChange={(e) =>
                    setAnonymousName(e.target.value.toLowerCase())
                  }
                  placeholder="e.g. midnightecho"
                  maxLength={20}
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-zinc-600 transition text-white placeholder:text-zinc-600"
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={usernameError ? "text-red-400" : "text-zinc-500"}>
                    {usernameError || "Only lowercase letters, numbers, and underscores."}
                  </span>
                  <span className="text-zinc-600">{anonymousName.length}/20</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Bio <span className="text-zinc-500">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a line about the silence you carry..."
                  maxLength={160}
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-zinc-600 transition text-white placeholder:text-zinc-600 resize-none"
                />
                <div className="mt-2 text-right text-xs text-zinc-600">
                  {bio.length}/160
                </div>
              </div>

              {/* Rules */}
              <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-400 space-y-1">
                <p>• Your real name is never shown publicly.</p>
                <p>• Pick something unique and memorable.</p>
                <p>• You can change this later (if you add edit profile).</p>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading || !!usernameError || !anonymousName.trim()}
                className="w-full rounded-2xl bg-white text-black font-medium py-3 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating your identity..." : "Enter HalfWritten"}
              </button>
            </form>
          </div>

          {/* Mobile Branding */}
          <div className="md:hidden mt-6 text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-[0.25em]">
              HalfWritten
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}