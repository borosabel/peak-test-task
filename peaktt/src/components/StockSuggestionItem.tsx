import React from "react";
import { StockSuggestion } from "@/types/alphaVantageTypes";

interface StockSuggestionItemProps {
  suggestion: StockSuggestion;
}

const StockSuggestionItem: React.FC<StockSuggestionItemProps> = ({
  suggestion,
}) => {
  return (
    <li className="py-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer rounded-md">
      <span className="font-semibold">{suggestion.symbol}</span> -{" "}
      {suggestion.name}
    </li>
  );
};

export default StockSuggestionItem;
