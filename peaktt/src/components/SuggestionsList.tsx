"use client";

import React from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";
import StockSuggestionItem from "@/components/StockSuggestionItem";

interface SuggestionsListProps {
  stocks: StockSuggestion[];
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  stocks,
  favorites,
  onToggleFavorite,
}) => {
  return (
    <ul className="list-none">
      {stocks.map((stock) => (
        <StockSuggestionItem
          key={stock.symbol}
          suggestion={stock}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(stock.symbol)}
        />
      ))}
    </ul>
  );
};

export default SuggestionsList;
