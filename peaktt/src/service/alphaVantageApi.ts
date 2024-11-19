import {
  AlphaVantageSuggestion,
  StockHistoryResponse,
  StockQuote,
  StockSuggestion,
  TimeSeriesValue,
} from "@/types/alphaVantageTypes";

export const BASE_URL = process.env.NEXT_PUBLIC_ALPHAVANTAGE_BASE_URL;
export const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;

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

    console.log(response);

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

export async function fetchStockHistory(
  symbol: string,
): Promise<StockHistoryResponse> {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
    symbol,
  )}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching stock history: ${response.statusText}`);
    }

    const data = await response.json();

    if (data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"] as Record<
        string,
        TimeSeriesValue
      >;

      const history: StockHistoryResponse = Object.entries(timeSeries).map(
        ([date, value]) => ({
          date,
          close: parseFloat(value["4. close"]),
        }),
      );

      return history;
    } else {
      throw new Error("Historical data not available");
    }
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw new Error("Failed to fetch stock history. Please try again later.");
  }
}

// Mocked Stock Data
// const mockedStockSuggestions: StockSuggestion[] = [
//   { symbol: "AAPL", name: "Apple Inc." },
//   { symbol: "GOOGL", name: "Alphabet Inc." },
//   { symbol: "TSLA", name: "Tesla Inc." },
//   { symbol: "MSFT", name: "Microsoft Corporation" },
//   { symbol: "AMZN", name: "Amazon.com, Inc." },
//   { symbol: "NFLX", name: "Netflix, Inc." },
//   { symbol: "META", name: "Meta Platforms, Inc." },
// ];
//
// const mockedStockDetails: Record<string, StockQuote> = {
//   AAPL: {
//     symbol: "AAPL",
//     price: "150.00",
//     open: "148.00",
//     high: "151.00",
//     low: "147.00",
//     volume: "10000000",
//     previousClose: "149.00",
//     change: "1.00",
//     changePercent: "0.67%",
//   },
//   GOOGL: {
//     symbol: "GOOGL",
//     price: "2800.00",
//     open: "2750.00",
//     high: "2850.00",
//     low: "2730.00",
//     volume: "1500000",
//     previousClose: "2795.00",
//     change: "5.00",
//     changePercent: "0.18%",
//   },
//   TSLA: {
//     symbol: "TSLA",
//     price: "800.00",
//     open: "790.00",
//     high: "820.00",
//     low: "785.00",
//     volume: "5000000",
//     previousClose: "795.00",
//     change: "5.00",
//     changePercent: "0.63%",
//   },
// };
//
// const mockedStockHistory: Record<string, StockHistoryResponse> = {
//   AAPL: [
//     { date: "2024-11-18", close: 150.0 },
//     { date: "2024-11-17", close: 148.5 },
//     { date: "2024-11-16", close: 149.0 },
//     { date: "2024-11-15", close: 151.0 },
//     { date: "2024-11-14", close: 149.8 },
//   ],
//   GOOGL: [
//     { date: "2024-11-18", close: 2800.0 },
//     { date: "2024-11-17", close: 2775.5 },
//     { date: "2024-11-16", close: 2780.0 },
//     { date: "2024-11-15", close: 2805.0 },
//     { date: "2024-11-14", close: 2790.8 },
//   ],
//   TSLA: [
//     { date: "2024-11-18", close: 800.0 },
//     { date: "2024-11-17", close: 705.5 },
//     { date: "2024-11-16", close: 728.0 },
//     { date: "2024-11-15", close: 855.0 },
//     { date: "2024-11-14", close: 799.8 },
//   ],
// };
//
// export async function fetchStockSuggestions(
//   query: string,
//   limit: number = 10,
// ): Promise<StockSuggestion[]> {
//   console.log(
//     `Mocked API call: Fetching stock suggestions for query "${query}"`,
//   );
//
//   const filteredSuggestions = mockedStockSuggestions.filter(
//     (suggestion) =>
//       suggestion.symbol.toLowerCase().includes(query.toLowerCase()) ||
//       suggestion.name.toLowerCase().includes(query.toLowerCase()),
//   );
//
//   return filteredSuggestions.slice(0, limit);
// }
//
// export async function fetchStockDetails(symbol: string): Promise<StockQuote> {
//   console.log(`Mocked API call: Fetching stock details for symbol "${symbol}"`);
//
//   if (!mockedStockDetails[symbol]) {
//     throw new Error(`No mock data found for symbol "${symbol}"`);
//   }
//
//   return mockedStockDetails[symbol];
// }
//
// export async function fetchStockHistory(
//   symbol: string,
// ): Promise<StockHistoryResponse> {
//   console.log(`Mocked API call: Fetching stock history for symbol "${symbol}"`);
//
//   if (!mockedStockHistory[symbol]) {
//     throw new Error(`No mock data found for symbol "${symbol}"`);
//   }
//
//   return mockedStockHistory[symbol];
// }
