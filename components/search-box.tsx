"use client";

import { Search } from "lucide-react";

export function SearchBox() {
  return (
    <form action="/dashboard/packages" className="search-box">
      <Search size={18} />
      <input name="q" placeholder="Search tracking code, sender, receiver" />
      <button>Search</button>
    </form>
  );
}
