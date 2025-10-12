import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketOverview from "@/components/dashboard/MarketOverview";
import StockHeatmap from "@/components/widgets/StockHeatmap";
import NewsFeed from "@/components/widgets/NewsFeed";
import TickerTape from "@/components/widgets/TickerTape";
import Navbar from "@/components/dashboard/Navbar";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Ticker Tape */}
      <div className="border-b border-border/30">
        <TickerTape />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <MarketOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-2 bg-gradient-surface border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Market Heatmap - S&P 500</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <StockHeatmap />
            </CardContent>
          </Card>
          <Card className="bg-gradient-surface border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Market News</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <NewsFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}