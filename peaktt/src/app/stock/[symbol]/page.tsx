import { fetchStockDetails } from "@/service/alphaVantageApi";

interface StockDetailsPageProps {
  params: { symbol: string };
}

const StockDetailsPage = async ({ params }: StockDetailsPageProps) => {
  const symbol = (await params).symbol;
  const stockDetails = await fetchStockDetails(symbol);

  return <div>{stockDetails.price}</div>;
};

export default StockDetailsPage;
