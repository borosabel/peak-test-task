"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SuggestionsList from "@/components/SuggestionsList";

const StocksPage: React.FC = () => {
  const router = useRouter();

  const initialQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("query") || ""
      : "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    if (query) {
      currentParams.set("query", query);
    } else {
      currentParams.delete("query");
    }

    router.replace(`/stocks?${currentParams.toString()}`);
    setSubmittedQuery(query);
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Stock Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </form>

      {submittedQuery && <SuggestionsList query={submittedQuery} />}
    </div>
  );
};

export default StocksPage;
