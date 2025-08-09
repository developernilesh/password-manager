"use client";

import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiLock, FiCreditCard, FiKey } from "react-icons/fi";
import { UserButton, useUser } from "@clerk/nextjs";

const menuItems = [
  {
    name: "Dashboard",
    icon: FiHome,
    path: "/user/dashboard",
    description: "Overview and statistics",
  },
  {
    name: "Passwords",
    icon: FiLock,
    path: "/user/passwords",
    description: "Manage your passwords",
  },
  {
    name: "Credit Cards",
    icon: FiCreditCard,
    path: "/user/credit-cards",
    description: "Secure credit card storage",
  },
  {
    name: "Password Generator",
    icon: FiKey,
    path: "/user/password-generator",
    description: "Generate strong passwords",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="hidden md:flex md:w-80 lg:w-80 flex-col h-full bg-gray-900 border-r border-gray-700">
      <div className="flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  pathname === item.path
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <UserButton />
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-300">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName
                  ? user.firstName
                  : user?.emailAddresses?.[0]?.emailAddress
                  ? formatEmailName(user.emailAddresses[0].emailAddress)
                  : "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatEmailName(email: string) {
  const localPart = email.split("@")[0]; // Step 1
  const nameParts = localPart.split("."); // Step 2

  const formattedName = nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Step 3
    .join(" "); // Step 4

  return formattedName;
}
