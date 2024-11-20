"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import SuggestionsList from "@/components/SuggestionsList";
import SearchField from "@/components/SearchField";
import { StockSuggestion } from "@/types/alphaVantageTypes";

const mockStockSuggestions: StockSuggestion[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
];

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
    } else {
      router.replace(`/stocks`);
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
      const newFavorite = mockStockSuggestions.find(
        (stock) => stock.symbol === symbol,
      );
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

  const filteredStocks = mockStockSuggestions.filter(
    (stock) =>
      stock.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

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
          <SuggestionsList
            stocks={filteredStocks}
            favorites={Array.from(favorites.keys())}
            onToggleFavorite={handleToggleFavorite}
          />
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
