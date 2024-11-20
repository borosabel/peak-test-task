import { useState, useEffect } from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";
import { fetchStockSuggestions } from "@/service/alphaVantageApi";

const cache = new Map<string, StockSuggestion[]>();

export const useStockSuggestions = (debouncedQuery: string) => {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedQuery) {
      const fetchSuggestions = async () => {
        if (cache.has(debouncedQuery)) {
          setSuggestions(cache.get(debouncedQuery) || []);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          const results = await fetchStockSuggestions(debouncedQuery);
          setSuggestions(results);
          cache.set(debouncedQuery, results);
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
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return { suggestions, isLoading, error };
};
