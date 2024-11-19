"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import SuggestionsList from "@/components/SuggestionsList";

const StocksPage: React.FC = () => {
  const router = useRouter();

  const initialQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("query") || ""
      : "";

  const [query, setQuery] = useState(initialQuery);

  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(query, 400);

  React.useEffect(() => {
    if (debouncedQuery) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("query", debouncedQuery);
      router.replace(`/stocks?${currentParams.toString()}`);
    } else {
      router.replace(`/stocks`);
    }
  }, [debouncedQuery, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setDebouncedQuery(newValue);
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Stock Search</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for stocks"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </form>

      {debouncedQuery && <SuggestionsList query={debouncedQuery} />}
    </div>
  );
};

export default StocksPage;
