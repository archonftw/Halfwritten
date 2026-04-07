"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

type UserType = {
  _id: string;
  anonymousName: string;
  bio?: string;
  avatarSeed: string;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<UserType | null>(null);
  const [anonymousName, setAnonymousName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
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

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load profile.");
          router.push("/");
          return;
        }

        setUser(data.user);
        setAnonymousName(data.user.anonymousName || "");
        setBio(data.user.bio || "");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const usernameError = useMemo(() => {
    if (!anonymousName) return "";
    if (!USERNAME_REGEX.test(anonymousName)) {
      return "Use 3–20 chars: lowercase letters, numbers, underscores only.";
    }
    return "";
  }, [anonymousName]);

  const hasChanges =
    user &&
    (anonymousName.trim().toLowerCase() !== user.anonymousName ||
      bio.trim() !== (user.bio || ""));

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
      setSaving(true);

      const res = await fetch("/api/user/edit", {
        method: "PATCH",
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
        toast.error(data.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated ✍️");

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Loading your identity...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center">
      <Toaster position="top-center" />

      <div className="w-full max-w-3xl">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              HalfWritten
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-2">
              Edit Profile
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Refine the identity your words wear.
            </p>
          </div>

          {/* Avatar Preview */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${anonymousName || user?.avatarSeed}`}
              alt="Anonymous avatar"
              className="w-16 h-16 rounded-full border border-zinc-700 bg-black"
            />
            <div>
              <p className="text-sm text-zinc-500">Avatar Preview</p>
              <p className="text-zinc-300 text-sm">
                Changes automatically if your name changes.
              </p>
            </div>
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
                onChange={(e) => setAnonymousName(e.target.value.toLowerCase())}
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full rounded-2xl border border-zinc-800 bg-black text-white font-medium py-3 hover:border-zinc-700 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  !!usernameError ||
                  !anonymousName.trim() ||
                  !hasChanges
                }
                className="w-full rounded-2xl bg-white text-black font-medium py-3 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}