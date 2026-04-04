import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome back to <span className="text-zinc-300">HalfWritten</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-md">
            Where unfinished thoughts become stories. Read, write, and leave your words behind.
          </p>
        </div>

        {/* Right Side Clerk SignIn */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-3xl shadow-2xl",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton:
                  "bg-zinc-800 border border-zinc-600 text-white hover:bg-zinc-700 rounded-xl",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-zinc-700",
                dividerText: "text-zinc-400",
                formFieldLabel: "text-zinc-300",
                formFieldInput:
                  "bg-zinc-800 text-white border border-zinc-600 rounded-xl focus:border-white",
                formButtonPrimary:
                  "bg-white text-black hover:bg-zinc-200 rounded-xl font-semibold",
                footer:'hidden',
                footerAction:'hidden'
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}