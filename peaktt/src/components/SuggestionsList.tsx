"use client";

import React, { useState, useEffect } from "react";
import { fetchStockSuggestions } from "@/service/alphaVantageApi";
import { StockSuggestion } from "@/types/alphaVantageTypes";
import StockSuggestionItem from "@/components/StockSuggestionItem";

interface SuggestionsListProps {
  query: string;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ query }) => {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchStockSuggestions(query);
        setSuggestions(results);
      } catch (err) {
        console.error("Error fetching stock suggestions:", err);
        setError("Failed to fetch stock suggestions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]);

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
        <StockSuggestionItem key={suggestion.symbol} suggestion={suggestion} />
      ))}
    </ul>
  );
};

export default SuggestionsList;
