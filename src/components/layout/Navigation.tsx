"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { usePersona } from "@/contexts/PersonaContext";
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  Home,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const { data: session } = useSession();
  const { currentPersona } = usePersona();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';
  const isAccessibilityFocused = currentPersona?.preferences.accessibilityNeeds.length > 0;

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Search },
    { name: "Chat", href: "/tambo", icon: MessageCircle },
    ...(session?.user ? [{ name: "Dashboard", href: "/dashboard", icon: BarChart3 }] : [])
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn(
      "bg-white border-b sticky top-0 z-50",
      theme === 'high-contrast' && "border-black border-2",
      theme === 'dark' && "bg-gray-800 border-gray-700"
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              "flex items-center space-x-2 font-bold text-xl",
              fontSize === 'large' && "text-2xl",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}
          >
            <ShoppingBag className={cn(
              "w-6 h-6 text-primary",
              fontSize === 'large' && "w-8 h-8"
            )} />
            <span>ShopAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    fontSize === 'large' && "text-base py-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    theme === 'dark' && !isActive(item.href) && "text-gray-300 hover:text-white hover:bg-gray-700",
                    theme === 'dark' && isActive(item.href) && "text-primary bg-primary/20",
                    isAccessibilityFocused && "focus:outline-none focus:ring-4 focus:ring-primary/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    fontSize === 'large' && "text-base py-3",
                    theme === 'dark' && "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  <User className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
                  <span>{session.user.name || "Profile"}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900",
                    fontSize === 'large' && "text-base py-3 px-6",
                    theme === 'dark' && "text-gray-300 hover:text-white"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium",
                    fontSize === 'large' && "text-base py-3 px-6"
                  )}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              theme === 'dark' && "text-gray-300 hover:text-white hover:bg-gray-700"
            )}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={cn(
            "md:hidden border-t",
            theme === 'high-contrast' && "border-black",
            theme === 'dark' && "border-gray-700"
          )}>
            <div className="py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      theme === 'dark' && !isActive(item.href) && "text-gray-300 hover:text-white hover:bg-gray-700",
                      theme === 'dark' && isActive(item.href) && "text-primary bg-primary/20"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="border-t pt-4 mt-4">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors",
                      "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      theme === 'dark' && "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}
                  >
                    <User className="w-5 h-5" />
                    <span>{session.user.name || "Profile"}</span>
                  </Link>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}