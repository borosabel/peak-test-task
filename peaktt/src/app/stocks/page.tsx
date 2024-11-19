"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SuggestionsList from "@/components/SuggestionsList";

const StocksPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    if (query) {
      currentParams.set("query", query);
    } else {
      currentParams.delete("query");
    }
    router.replace(`/stocks?${currentParams.toString()}`);
  }, [query, router, searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Stock Search</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </form>

      {debouncedQuery && <SuggestionsList query={debouncedQuery} />}
    </div>
  );
};

export default StocksPage;
