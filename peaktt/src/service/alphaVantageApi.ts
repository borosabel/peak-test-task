import { AlphaVantageSuggestion } from "@/types/alphaVantageTypes";

export const BASE_URL = "https://www.alphavantage.co/query";
export const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

export async function fetchStockSuggestions(query: string, limit: number = 10) {
  const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
    query,
  )}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching suggestions: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Note) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }

    const bestMatches = data.bestMatches || [];
    return bestMatches.slice(0, limit).map((match: AlphaVantageSuggestion) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
    }));
  } catch (error) {
    console.error("Error in fetchStockSuggestions:", error);
    throw error;
  }
}

export async function fetchStockDetails(symbol: string) {
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
    symbol,
  )}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching stock details: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Note) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }

    const stock = data["Global Quote"];
    if (!stock || Object.keys(stock).length === 0) {
      throw new Error("Stock data not available.");
    }

    return {
      symbol: stock["01. symbol"],
      price: stock["05. price"],
      open: stock["02. open"],
      high: stock["03. high"],
      low: stock["04. low"],
      volume: stock["06. volume"],
      previousClose: stock["08. previous close"],
      change: stock["09. change"],
      changePercent: stock["10. change percent"],
    };
  } catch (error) {
    console.error("Error in fetchStockDetails:", error);
    throw error;
  }
}
