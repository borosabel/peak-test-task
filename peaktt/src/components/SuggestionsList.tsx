"use client";

import React from "react";
import { SuggestionsListProps } from "@/types/alphaVantageTypes";
import StockSuggestionItem from "@/components/StockSuggestionItem";

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
