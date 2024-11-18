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
