"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  UserCircleIcon,
  FilmIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-primary relative z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-accent transition-colors"
            >
              <FilmIcon className="h-8 w-8" />
              <span className="text-xl font-bold">Popcorn</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-accent transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "text-accent"
                  : "text-white hover:text-accent"
              } transition-colors text-sm font-medium`}
            >
              Home
            </Link>

            {session && (
              <>
                <Link
                  href="/watchlist"
                  className={`${
                    pathname === "/watchlist"
                      ? "text-accent"
                      : "text-white hover:text-accent"
                  } transition-colors text-sm font-medium`}
                >
                  My Watchlist
                </Link>
                <Link
                  href="/watched"
                  className={`${
                    pathname === "/watched"
                      ? "text-accent"
                      : "text-white hover:text-accent"
                  } transition-colors text-sm font-medium`}
                >
                  Watched Movies
                </Link>
              </>
            )}

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="animate-pulse bg-primary-dark h-8 w-20 rounded" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-white hover:text-accent transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-primary-dark rounded-lg shadow-xl z-50">
                    <div className="px-4 py-2 border-b border-primary">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:text-accent hover:bg-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-white hover:text-accent transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white hover:bg-gray-100 text-primary px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-dark">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`${
                  pathname === "/"
                    ? "text-accent"
                    : "text-white hover:text-accent"
                } transition-colors text-sm font-medium`}
              >
                Home
              </Link>

              {session && (
                <>
                  <Link
                    href="/watchlist"
                    className={`${
                      pathname === "/watchlist"
                        ? "text-accent"
                        : "text-white hover:text-accent"
                    } transition-colors text-sm font-medium`}
                  >
                    My Watchlist
                  </Link>
                  <Link
                    href="/watched"
                    className={`${
                      pathname === "/watched"
                        ? "text-accent"
                        : "text-white hover:text-accent"
                    } transition-colors text-sm font-medium`}
                  >
                    Watched Movies
                  </Link>
                </>
              )}

              {!session && (
                <div className="flex flex-col space-y-4 pt-4 border-t border-primary-dark">
                  <Link
                    href="/login"
                    className="text-white hover:text-accent transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white hover:bg-gray-100 text-primary px-4 py-2 rounded-lg transition-colors text-sm font-medium w-fit"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {session && (
                <div className="pt-4 border-t border-primary-dark">
                  <div className="px-2 py-2">
                    <p className="text-sm text-gray-300">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-sm text-white hover:text-accent transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
