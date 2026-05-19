import React from "react";

function NavBar() {
  return (
    <div className="flex justify-around items-center py-4 border-2 lg:w-5xl m-auto rounded-full">
      <div>Stream Flex</div>

      <div>
        <ul className="flex gap-4">
          <li>Home</li>
          <li>Movies</li>
          <li>Tv Series</li>
        </ul>
      </div>

      <div>
        <div className="rounded-full bg-emerald-400 size-8"></div>
      </div>
    </div>
  );
}

export default NavBar;
