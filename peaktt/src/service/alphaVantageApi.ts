import {
  AlphaVantageSuggestion,
  StockQuote,
  StockSuggestion,
} from "@/types/alphaVantageTypes";

export const BASE_URL = process.env.NEXT_PUBLIC_ALPHAVANTAGE_BASE_URL;
export const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (!BASE_URL) {
  throw new Error("Environment variable ALPHAVANTAGE_BASE_URL is not set.");
}

if (!API_KEY) {
  throw new Error("Environment variable ALPHAVANTAGE_API_KEY is not set.");
}

/**
 * Fetch stock suggestions based on a query string.
 * @param query - The search query to find stock symbols.
 * @param limit - The maximum number of results to return.
 * @returns A list of stock suggestions.
 * @throws Will throw an error if the API call fails or the rate limit is exceeded.
 */
export async function fetchStockSuggestions(
  query: string,
  limit: number = 10,
): Promise<StockSuggestion[]> {
  const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;

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
      type: match["3. type"],
      region: match["4. region"],
      marketOpen: match["5. marketOpen"],
      marketClose: match["6. marketClose"],
      timezone: match["7. timezone"],
      currency: match["8. currency"],
      matchScore: match["9. matchScore"],
    }));
  } catch (error) {
    console.error(
      `Error in fetchStockSuggestions for query "${query}":`,
      error,
    );
    throw new Error(
      "Failed to fetch stock suggestions. Please try again later.",
    );
  }
}

/**
 * Fetch detailed stock information for a given symbol.
 * @param symbol - The stock symbol to fetch details for.
 * @returns The stock quote details.
 * @throws Will throw an error if the stock data is unavailable or the API call fails.
 */
export async function fetchStockDetails(symbol: string): Promise<StockQuote> {
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;

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
    console.error(`Error in fetchStockDetails for symbol "${symbol}":`, error);
    throw new Error("Failed to fetch stock details. Please try again later.");
  }
}
