// frontend/src/components/SearchBar.jsx

import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Input ပြောင်းလဲတိုင်း Parent ကို Search Term ပြန်ပို့
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Form Submit လုပ်ရင် Page Reload မဖြစ်အောင်
    // onSearch(searchTerm); // Enter နှိပ်မှ ရှာချင်ရင် ဒီနေရာမှာ ခေါ်
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
