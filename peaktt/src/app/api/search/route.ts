import { NextRequest, NextResponse } from "next/server";
import { fetchStockSuggestions } from "@/service/alphaVantageApi";
import { StockSuggestionsResponse } from "@/types/alphaVantageTypes";

export async function GET(req: NextRequest): Promise<NextResponse<StockSuggestionsResponse | { error: string }>> {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = process.env.NEXT_PUBLIC_STOCK_SUGGESTION_LIMIT
      ? parseInt(process.env.NEXT_PUBLIC_STOCK_SUGGESTION_LIMIT, 10)
      : undefined;

  if (!query) {
    return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
    );
  }

  try {
    const suggestions = await fetchStockSuggestions(query, limit);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "Failed to fetch stock suggestions" },
        { status: 500 }
    );
  }
}
