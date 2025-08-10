"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiLock, 
  FiCreditCard, 
  FiKey
} from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    icon: FiHome,
    path: "/user/dashboard",
  },
  {
    name: "Passwords",
    icon: FiLock,
    path: "/user/passwords",
  },
  {
    name: "Cards",
    icon: FiCreditCard,
    path: "/user/credit-cards",
  },
  {
    name: "Generator",
    icon: FiKey,
    path: "/user/password-generator",
  }
];

export function BottomBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-teal-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
