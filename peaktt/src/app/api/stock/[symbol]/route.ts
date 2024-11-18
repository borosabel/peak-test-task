import { NextRequest, NextResponse } from "next/server";
import { fetchStockDetails } from "@/service/alphaVantageApi";

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  try {
    const stockDetails = await fetchStockDetails(symbol);
    return NextResponse.json(stockDetails);
  } catch (error) {
    console.error("Error fetching stock details:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate limit exceeded")) {
        return NextResponse.json(
          { error: "API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      if (error.message.includes("Stock data not available")) {
        return NextResponse.json(
          { error: "Stock data not available." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch stock details" },
      { status: 500 }
    );
  }
}
