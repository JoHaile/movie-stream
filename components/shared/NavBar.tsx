import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="w-full relative py-4">
      <div className="flex justify-around items-center py-4 border-2 lg:w-5xl m-auto rounded-full sticky top-0 bg-white z-10">
        <div>Stream Flex</div>

        <div>
          <ul className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/movies">Movies</Link>
            <Link href="/tv-series">Tv Series</Link>
          </ul>
        </div>

        <div>
          <div className="rounded-full bg-emerald-400 size-8"></div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
