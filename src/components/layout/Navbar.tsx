"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  UserCircleIcon,
  FilmIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useMovieSearch } from "@/hooks/useMovieSearch";
import { SearchResultsView } from "@/components/movies/SearchResultsView";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullResults, setShowFullResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { results, isLoading, error } = useMovieSearch(searchQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowFullResults(true);
      setIsSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    } else if (e.key === "Enter" && results.length === 1) {
      // Only navigate to the first result if it's the only result
      e.preventDefault();
      handleMovieClick(results[0].id);
    }
  };

  if (showFullResults) {
    return (
      <>
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

              {/* Search Bar */}
              <div
                className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-4"
                ref={searchRef}
              >
                <div className="relative w-full">
                  {!isSearchOpen ? (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="text-white hover:text-accent transition-colors p-2"
                    >
                      <MagnifyingGlassIcon className="h-6 w-6" />
                    </button>
                  ) : (
                    <div className="w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies..."
                        className="w-full px-4 py-2 rounded-lg bg-primary-dark text-white border border-gray-700 focus:outline-none focus:border-accent"
                        autoFocus
                      />
                      {searchQuery && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-primary-dark rounded-lg shadow-xl max-h-96 overflow-y-auto">
                          {results.map((movie) => (
                            <button
                              key={movie.id}
                              onClick={() => handleMovieClick(movie.id)}
                              className="w-full text-left px-4 py-2 hover:bg-primary transition-colors text-white"
                            >
                              {movie.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
          </nav>
        </header>
        <main>
          <SearchResultsView
            query={searchQuery}
            results={results}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </>
    );
  }

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

          {/* Search Bar */}
          <div
            className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-4"
            ref={searchRef}
          >
            <div className="relative w-full">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:text-accent transition-colors p-2"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              ) : (
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search movies..."
                    className="w-full px-4 py-2 rounded-lg bg-primary-dark text-white border border-gray-700 focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  {searchQuery && results.length > 0 && !showFullResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-primary-dark rounded-lg shadow-xl max-h-96 overflow-y-auto">
                      {results.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent form submission
                            handleMovieClick(movie.id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-primary transition-colors text-white"
                        >
                          {movie.title}
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                          handleSearch(e);
                        }}
                        className="w-full text-left px-4 py-2 text-accent hover:bg-primary transition-colors border-t border-primary"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
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
            {/* Add mobile search */}
            <div className="mb-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search movies..."
                  className="w-full px-4 py-2 rounded-lg bg-primary-dark text-white border border-gray-700 focus:outline-none focus:border-accent"
                />
              </form>
              {searchQuery && results.length > 0 && !showFullResults && (
                <div className="mt-2 bg-primary-dark rounded-lg shadow-xl max-h-96 overflow-y-auto">
                  {results.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        handleMovieClick(movie.id);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-primary transition-colors text-white"
                    >
                      {movie.title}
                    </button>
                  ))}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handleSearch(e);
                    }}
                    className="w-full text-left px-4 py-2 text-accent hover:bg-primary transition-colors border-t border-primary"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
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
