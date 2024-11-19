import React from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";

interface StockSuggestionItemProps {
  suggestion: StockSuggestion;
  onToggleFavorite: (symbol: string) => void;
  isFavorite: boolean;
}

const StockSuggestionItem: React.FC<StockSuggestionItemProps> = ({
  suggestion,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <li className="py-2 border-b border-gray-300 flex justify-between items-center">
      <div>
        <span className="font-semibold">{suggestion.symbol}</span> -{" "}
        {suggestion.name}
      </div>
      <button
        onClick={() => onToggleFavorite(suggestion.symbol)}
        className={`px-3 py-1 ml-4 rounded-md ${isFavorite ? "bg-red-500 text-white" : "bg-gray-300"}`}
      >
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
    </li>
  );
};

export default StockSuggestionItem;
