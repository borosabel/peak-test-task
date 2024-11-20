"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import SuggestionsList from "@/components/SuggestionsList";
import SearchField from "@/components/SearchField";
import { StockSuggestion } from "@/types/alphaVantageTypes";
import { fetchStockSuggestions } from "@/service/alphaVantageApi";

const StocksPage: React.FC = () => {
  const router = useRouter();
  const initialQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("query") || ""
      : "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(query, 400);
  const [favorites, setFavorites] = useState<Map<string, StockSuggestion>>(
    new Map(),
  );
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteStocks");
    if (storedFavorites) {
      const favoritesArray: StockSuggestion[] = JSON.parse(storedFavorites);
      setFavorites(new Map(favoritesArray.map((fav) => [fav.symbol, fav])));
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("query", debouncedQuery);
      router.replace(`/stocks?${currentParams.toString()}`);

      const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const results = await fetchStockSuggestions(debouncedQuery);
          setSuggestions(results);
        } catch (error) {
          console.error("Failed to fetch stock suggestions:", error);
          setError(
            "Failed to fetch stock suggestions. Please try again later.",
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      router.replace(`/stocks`);
      setSuggestions([]);
    }
  }, [debouncedQuery, router]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setDebouncedQuery(value);
  };

  const handleToggleFavorite = (symbol: string) => {
    const updatedFavorites = new Map(favorites);
    if (favorites.has(symbol)) {
      updatedFavorites.delete(symbol);
    } else {
      const newFavorite = suggestions.find((stock) => stock.symbol === symbol);
      if (newFavorite) {
        updatedFavorites.set(symbol, newFavorite);
      }
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "favoriteStocks",
      JSON.stringify(Array.from(updatedFavorites.values())),
    );
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

        {debouncedQuery ? (
          isLoading ? (
            <p className="mt-5 text-[#f37a59]">Loading...</p>
          ) : error ? (
            <p className="mt-5 text-[#f37a59]">{error}</p>
          ) : (
            <SuggestionsList
              stocks={suggestions}
              favorites={Array.from(favorites.keys())}
              onToggleFavorite={handleToggleFavorite}
            />
          )
        ) : favorites.size > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#f37a59]">
              Favorite Stocks
            </h2>
            <SuggestionsList
              stocks={Array.from(favorites.values())}
              favorites={Array.from(favorites.keys())}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        ) : (
          <p className="mt-5 text-[#f37a59]">
            Use the search bar above to find stocks.
          </p>
        )}
      </div>
    </div>
  );
};

export default StocksPage;
