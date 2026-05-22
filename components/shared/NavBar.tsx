"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SearchIcon, BellIcon } from "lucide-react";

function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv-series", label: "TV Series" },
  ];

  return (
    <div className="w-full relative py-3 px-4 z-50">
      <div className="flex justify-between items-center py-3 px-6 border border-border/60 max-w-5xl mx-auto rounded-full sticky top-0 bg-white/95 backdrop-blur-md shadow-sm">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-black tracking-tight hover:opacity-80 transition-opacity"
        >
          StreamFlix
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="block h-0.5 mt-0.5 bg-foreground rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <BellIcon className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
