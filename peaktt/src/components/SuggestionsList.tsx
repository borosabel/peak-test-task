import { fetchStockSuggestions } from "@/service/alphaVantageApi";
import { StockSuggestion } from "@/types/alphaVantageTypes";

interface SuggestionsListProps {
  query: string;
}

const SuggestionsList = async ({ query }: SuggestionsListProps) => {
  let suggestions: StockSuggestion[] = [];

  try {
    suggestions = await fetchStockSuggestions(query);
  } catch (error) {
    console.error("Error fetching stock suggestions:", error);
    return (
      <div className="text-red-500 mt-5">
        Failed to fetch stock suggestions. Please try again later.
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <p className="mt-5">
        No results found for &#34;<span className="font-semibold">{query}</span>
        &#34;.
      </p>
    );
  }

  return (
    <ul className="list-none mt-5">
      {suggestions.map((suggestion) => (
        <li key={suggestion.symbol} className="py-2 border-b border-gray-300">
          <span className="font-semibold">{suggestion.symbol}</span> -{" "}
          {suggestion.name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
