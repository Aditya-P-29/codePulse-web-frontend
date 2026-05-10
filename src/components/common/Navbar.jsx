import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUser, FaPlus } from "react-icons/fa6";
import logo from "../../assets/logo-img.png";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-gray-800 text-white"
      : "text-gray-400 hover:bg-gray-800/80 hover:text-white",
  ].join(" ");

function Navbar({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[min(1680px,calc(100vw-24px))] items-center justify-between gap-4 px-3 sm:px-4 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none ring-blue-500/40 focus-visible:ring-2"
            >
              <img
                src={logo}
                alt=""
                className="h-9 w-auto rounded-xl ring-1 ring-white/10"
              />
              <span className="text-lg font-semibold tracking-tight text-white">
                VCS
              </span>
            </Link>

            <nav
              className="hidden items-center gap-0.5 sm:flex"
              aria-label="Main navigation"
            >
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/repo/create"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <FaPlus className="h-3.5 w-3.5" aria-hidden />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New repository</span>
            </Link>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                [
                  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/80 hover:text-white",
                ].join(" ")
              }
            >
              <FaUser className="h-3.5 w-3.5 opacity-90" aria-hidden />
              <span className="hidden md:inline">Profile</span>
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Navbar;
