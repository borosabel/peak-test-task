import {
  AlphaVantageSuggestion,
  StockHistoryEntry,
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
//
// /**
//  * Fetch detailed stock information for a given symbol.
//  * @param symbol - The stock symbol to fetch details for.
//  * @returns The stock quote details.
//  * @throws Will throw an error if the stock data is unavailable or the API call fails.
//  */
// export async function fetchStockDetails(symbol: string): Promise<StockQuote> {
//   const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
//
//   try {
//     const response = await fetch(url);
//
//     if (!response.ok) {
//       throw new Error(`Error fetching stock details: ${response.statusText}`);
//     }
//
//     const data = await response.json();
//
//     if (data.Note) {
//       throw new Error("API rate limit exceeded. Please try again later.");
//     }
//
//     const stock = data["Global Quote"];
//     if (!stock || Object.keys(stock).length === 0) {
//       throw new Error("Stock data not available.");
//     }
//
//     return {
//       symbol: stock["01. symbol"],
//       price: stock["05. price"],
//       open: stock["02. open"],
//       high: stock["03. high"],
//       low: stock["04. low"],
//       volume: stock["06. volume"],
//       previousClose: stock["08. previous close"],
//       change: stock["09. change"],
//       changePercent: stock["10. change percent"],
//     };
//   } catch (error) {
//     console.error(`Error in fetchStockDetails for symbol "${symbol}":`, error);
//     throw new Error("Failed to fetch stock details. Please try again later.");
//   }
// }
//
// /**
//  * Fetch stock history based on a given time frame.
//  */
// export async function fetchStockHistory(
//   symbol: string,
//   timeFrame: "daily" | "weekly" | "monthly" = "daily",
// ): Promise<StockHistoryResponse> {
//   const functionType = {
//     daily: "TIME_SERIES_DAILY",
//     weekly: "TIME_SERIES_WEEKLY",
//     monthly: "TIME_SERIES_MONTHLY",
//   }[timeFrame];
//
//   const url = `${BASE_URL}?function=${functionType}&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
//
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`Error fetching stock history: ${response.statusText}`);
//   }
//
//   const data = await response.json();
//
//   let timeSeries: Record<string, TimeSeriesValue> | undefined;
//
//   if (data["Time Series (Daily)"]) {
//     timeSeries = data["Time Series (Daily)"];
//   } else if (data["Weekly Time Series"]) {
//     timeSeries = data["Weekly Time Series"];
//   } else if (data["Monthly Time Series"]) {
//     timeSeries = data["Monthly Time Series"];
//   }
//
//   if (!timeSeries) {
//     throw new Error("Historical data not available");
//   }
//
//   const history: StockHistoryResponse = Object.entries(timeSeries).map(
//     ([date, value]) => {
//       const typedValue = value as TimeSeriesValue;
//       return {
//         date,
//         close: parseFloat(typedValue["4. close"]),
//       };
//     },
//   );
//
//   return history;
// }

// Mocked Stock Data
// Mocked API data for stock details and history
const mockedStockDetails: Record<string, StockQuote> = {
  AAPL: {
    symbol: "AAPL",
    price: "150.00",
    open: "148.00",
    high: "152.00",
    low: "147.00",
    volume: "12000000",
    previousClose: "149.00",
    change: "1.00",
    changePercent: "0.67%",
  },
  GOOGL: {
    symbol: "GOOGL",
    price: "2800.00",
    open: "2770.00",
    high: "2820.00",
    low: "2765.00",
    volume: "8000000",
    previousClose: "2780.00",
    change: "20.00",
    changePercent: "0.72%",
  },
  TSLA: {
    symbol: "TSLA",
    price: "720.00",
    open: "710.00",
    high: "730.00",
    low: "705.00",
    volume: "15000000",
    previousClose: "715.00",
    change: "5.00",
    changePercent: "0.70%",
  },
};

const mockedStockHistory: Record<
  string,
  Record<string, StockHistoryEntry[]>
> = {
  AAPL: {
    daily: [
      { date: "2024-11-17", close: 150 },
      { date: "2024-11-16", close: 149 },
      { date: "2024-11-15", close: 151 },
    ],
    weekly: [
      { date: "2024-11-17", close: 150 },
      { date: "2024-11-10", close: 147 },
      { date: "2024-11-03", close: 145 },
    ],
    monthly: [
      { date: "2024-11-01", close: 150 },
      { date: "2024-10-01", close: 140 },
      { date: "2024-09-01", close: 135 },
    ],
  },
  GOOGL: {
    daily: [
      { date: "2024-11-17", close: 2800 },
      { date: "2024-11-16", close: 2780 },
      { date: "2024-11-15", close: 2790 },
    ],
    weekly: [
      { date: "2024-11-17", close: 2800 },
      { date: "2024-11-10", close: 2750 },
      { date: "2024-11-03", close: 2700 },
    ],
    monthly: [
      { date: "2024-11-01", close: 2800 },
      { date: "2024-10-01", close: 2600 },
      { date: "2024-09-01", close: 2500 },
    ],
  },
  TSLA: {
    daily: [
      { date: "2024-11-17", close: 720 },
      { date: "2024-11-16", close: 715 },
      { date: "2024-11-15", close: 710 },
    ],
    weekly: [
      { date: "2024-11-17", close: 720 },
      { date: "2024-11-10", close: 700 },
      { date: "2024-11-03", close: 680 },
    ],
    monthly: [
      { date: "2024-11-01", close: 720 },
      { date: "2024-10-01", close: 690 },
      { date: "2024-09-01", close: 670 },
    ],
  },
};

// Mocked API functions
export async function fetchStockDetails(symbol: string): Promise<StockQuote> {
  console.log(`Mocked API call: Fetching stock details for symbol "${symbol}"`);

  if (!mockedStockDetails[symbol]) {
    throw new Error(`No mock data found for symbol "${symbol}"`);
  }

  return mockedStockDetails[symbol];
}

export async function fetchStockHistory(
  symbol: string,
  timeFrame: "daily" | "weekly" | "monthly" = "daily",
): Promise<StockHistoryResponse> {
  console.log(
    `Mocked API call: Fetching stock history for symbol "${symbol}" and timeframe "${timeFrame}"`,
  );

  if (!mockedStockHistory[symbol]) {
    throw new Error(`No mock data found for symbol "${symbol}"`);
  }

  const history = mockedStockHistory[symbol][timeFrame];
  if (!history) {
    throw new Error(
      `No mock history data available for symbol "${symbol}" and timeframe "${timeFrame}"`,
    );
  }

  return history;
}

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
