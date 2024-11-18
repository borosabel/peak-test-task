import { fetchStockDetails } from "@/service/alphaVantageApi";

interface StockDetailsPageProps {
    params: Promise<{ symbol: string }>;
}

const StockDetailsPage = async ({ params }: StockDetailsPageProps) => {
    const { symbol } = await params;

    const stockDetails = await fetchStockDetails(symbol);

    return (
        <div>
            <h1>Stock: {stockDetails.symbol}</h1>
            <p>Price: {stockDetails.price}</p>
        </div>
    );
};

export default StockDetailsPage;
