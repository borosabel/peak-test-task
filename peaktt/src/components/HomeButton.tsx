import React from "react";

const SearchField: React.FC = ({}) => {
  return (
    <a
      href="/stocks"
      className="bg-[#f37a59] text-white px-4 py-2 rounded-md hover:bg-[#e06650] inline-flex items-center gap-2"
    >
      <span>&larr;</span> Back to Stock Search
    </a>
  );
};

export default SearchField;
