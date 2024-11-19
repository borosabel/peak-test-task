import React from 'react';
import StockDetails from '@/components/StockDetails';

interface PageProps {
    params: Promise<{slug: string}>
}

const StocksPage = async ({ params }: PageProps) => {
    const symbol = (await params).slug;

    if (!symbol) {
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>No stock selected.</div>;
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 3, padding: '20px' }}>
                <StockDetails symbol={symbol} />
            </div>
        </div>
    );
};

export default StocksPage;
