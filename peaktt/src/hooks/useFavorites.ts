import { useState, useEffect } from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";

export const useFavorites = () => {
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

  const toggleFavorite = (symbol: string, suggestions: StockSuggestion[]) => {
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

  return { favorites, toggleFavorite };
};
