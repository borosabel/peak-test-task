"use client";

import React, { useState, useEffect } from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";
import StockSuggestionItem from "@/components/StockSuggestionItem";

interface SuggestionsListProps {
  query: string;
}

const mockStockSuggestions: StockSuggestion[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
];

const SuggestionsList: React.FC<SuggestionsListProps> = ({ query }) => {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteStocks");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filteredSuggestions = mockStockSuggestions.filter(
          (stock) =>
            stock.name.toLowerCase().includes(query.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(query.toLowerCase()),
        );
        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.error("Error fetching stock suggestions:", err);
        setError("Failed to fetch stock suggestions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleToggleFavorite = (symbol: string) => {
    let updatedFavorites;
    if (favorites.includes(symbol)) {
      updatedFavorites = favorites.filter((fav) => fav !== symbol);
    } else {
      updatedFavorites = [...favorites, symbol];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteStocks", JSON.stringify(updatedFavorites));
  };

  if (isLoading) {
    return <p className="text-gray-500 mt-5">Loading suggestions...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-5">{error}</p>;
  }

  if (suggestions.length === 0) {
    return (
      <p className="mt-5">
        No results found for &#34;<span className="font-semibold">{query}</span>
        &#34;.
      </p>
    );
  }

  return (
    <ul className="list-none mt-5">
      {suggestions.map((suggestion) => (
        <StockSuggestionItem
          key={suggestion.symbol}
          suggestion={suggestion}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.includes(suggestion.symbol)}
        />
      ))}
    </ul>
  );
};

export default SuggestionsList;
