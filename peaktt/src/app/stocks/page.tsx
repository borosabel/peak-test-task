"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import SuggestionsList from "@/components/SuggestionsList";
import SearchField from "@/components/SearchField";
import { useFavorites } from "@/hooks/useFavorites";
import { useStockSuggestions } from "@/hooks/useStockSuggestions";

const StocksPage: React.FC = () => {
  const router = useRouter();
  const initialQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("query") || ""
      : "";
  const [query, setQuery] = React.useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(query, 400);
  const { favorites, toggleFavorite } = useFavorites();
  const { suggestions, isLoading, error } = useStockSuggestions(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("query", debouncedQuery);
      router.replace(`/stocks?${currentParams.toString()}`);
    } else {
      router.replace(`/stocks`);
    }
  }, [debouncedQuery, router]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setDebouncedQuery(value);
  };

  const handleToggleFavorite = (symbol: string) => {
    toggleFavorite(symbol, suggestions);
  };

  return (
    <div className="min-h-screen bg-[#f6f2ec] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#f37a59]">Stock Search</h1>
        <SearchField
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onClear={() => handleInputChange("")}
          placeholder="Search for stocks"
        />
        {debouncedQuery && isLoading ? (
          <p className="mt-5 text-[#f37a59]">Loading...</p>
        ) : debouncedQuery && error ? (
          <p className="mt-5 text-[#f37a59]">{error}</p>
        ) : debouncedQuery ? (
          <SuggestionsList
            stocks={suggestions}
            favorites={Array.from(favorites.keys())}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : null}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#f37a59]">
            Favorite Stocks
          </h2>
          {favorites.size == 0 ? (
            <h2 className="text-lg font-semibold mb-4 text-[#f37a59]">
              You do not have favorite stocks yet. Add a stock to your favorites
              by clicking on the green button.
            </h2>
          ) : (
            <SuggestionsList
              stocks={Array.from(favorites.values())}
              favorites={Array.from(favorites.keys())}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
        )
      </div>
    </div>
  );
};

export default StocksPage;
