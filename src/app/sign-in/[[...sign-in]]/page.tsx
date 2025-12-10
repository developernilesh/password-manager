// app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, ComponentType } from "react";
import { FiCopy, FiCheck, FiUser, FiKey, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function Page() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const testCredentials = {
    email: "tester.account@yopmail.com",
    password: "Test.pass@1046",
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CredentialItem = ({
    label,
    value,
    field,
    icon: Icon,
  }: {
    label: string;
    value: string;
    field: string;
    icon: ComponentType<{ className?: string }>;
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <Icon className="w-4 h-4 text-gray-500" />
        <div className="flex-1">
          <p className="text-xs text-gray-600 font-medium">{label}</p>
          <p className="text-sm font-mono text-gray-900 truncate">{value}</p>
        </div>
      </div>
      <button
        onClick={() => handleCopy(value, field)}
        className="ml-2 p-2 text-gray-400 hover:text-teal-600 hover:bg-white rounded-lg transition-all duration-200"
        title={`Copy ${label.toLowerCase()}`}
      >
        {copiedField === field ? (
          <FiCheck className="w-4 h-4 text-green-500" />
        ) : (
          <FiCopy className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-[398px]">
        {/* Back Button */}
        <button>
          <Link href="/">
            <div className="flex items-center gap-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all duration-200 px-3 py-2 rounded-lg border border-slate-700">
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </div>
          </Link>
        </button>

        {/* Test Credentials Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 my-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-5 bg-teal-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Test Account
            </h3>
          </div>

          <div className="space-y-3">
            <CredentialItem
              label="Email"
              value={testCredentials.email}
              field="email"
              icon={FiUser}
            />

            <CredentialItem
              label="Password"
              value={testCredentials.password}
              field="password"
              icon={FiKey}
            />
          </div>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/user/dashboard"
        />
      </div>
    </div>
  );
}
