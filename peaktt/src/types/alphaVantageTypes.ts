import React from "react";

export interface StockSuggestion {
  symbol: string;
  name: string;
}

export interface AlphaVantageSuggestion {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

export interface StockQuote {
  symbol: string;
  price: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  previousClose: string;
  change: string;
  changePercent: string;
}

export interface StockHistoryEntry {
  date: string;
  close: number;
}

export interface StockDetailsCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export interface TimeSeriesValue {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface StockSuggestionItemProps {
  suggestion: StockSuggestion;
  onToggleFavorite: (symbol: string) => void;
  isFavorite: boolean;
}

export interface StockDetailsProps {
  stock: StockQuote;
}

export interface SuggestionsListProps {
  stocks: StockSuggestion[];
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
}

export interface SearchFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

export interface StockChartProps {
  symbol: string;
  history: {
    daily: { success: boolean; data: StockHistoryResponse | null };
    weekly: { success: boolean; data: StockHistoryResponse | null };
    monthly: { success: boolean; data: StockHistoryResponse | null };
  };
  timeframe: "daily" | "weekly" | "monthly";
}

export type StockHistoryResponse = StockHistoryEntry[];
export type StockSuggestionsResponse = StockSuggestion[];
