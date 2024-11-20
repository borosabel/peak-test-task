"use client";

import React from "react";
import { SearchFieldProps } from "@/types/alphaVantageTypes";

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="mb-5 relative">
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 border text-black border-gray-400 rounded-md pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 text-gray-600 hover:text-gray-800"
          >
            ✖
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchField;
