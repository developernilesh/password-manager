// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button>
          <Link href="/">
            <div className="flex items-center gap-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all duration-200 mb-4 px-3 py-2 rounded-lg border border-slate-700">
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </div>
          </Link>
        </button>

        {/* Clerk SignUp Component */}
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/user/dashboard" />
      </div>
    </div>
  );
}
