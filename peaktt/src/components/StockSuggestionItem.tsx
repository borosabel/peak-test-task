"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  StockSuggestion,
  StockSuggestionItemProps,
} from "@/types/alphaVantageTypes";

const StockSuggestionItem: React.FC<StockSuggestionItemProps> = ({
  suggestion,
  onToggleFavorite,
  isFavorite,
}) => {
  const router = useRouter();

  const handleStockClick = () => {
    router.push(`/stock/${suggestion.symbol}`);
  };

  return (
    <li
      onClick={handleStockClick}
      className="py-4 px-6 border-b border-gray-300 flex justify-between items-center hover:shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="flex-1">
        <span className="font-semibold text-blue-600">{suggestion.symbol}</span>{" "}
        - <span className="text-blue-600">{suggestion.name}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(suggestion.symbol);
        }}
        className={`px-3 py-1 ml-4 rounded-none ${
          isFavorite ? "bg-red-500 text-white" : "bg-green-300"
        }`}
      >
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
    </li>
  );
};

export default StockSuggestionItem;
