import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, Globe, Coins, TrendingUp } from "lucide-react";
import StockHeatmap from "@/components/widgets/StockHeatmap";
import CryptoHeatmap from "@/components/widgets/CryptoHeatmap";
import ForexScreener from "@/components/widgets/ForexScreener";
import NewsFeed from "@/components/widgets/NewsFeed";
import TickerTape from "@/components/widgets/TickerTape";
import MarketOverview from "./MarketOverview";
import StockAnalyzer from "@/components/analysis/StockAnalyzer";

export default function TradingDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-trading rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Financial AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Advanced Market Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse-glow"></div>
              <span className="text-sm text-muted-foreground">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Tape */}
      
     <div className="border-b border-border/30">
  <TickerTape />

     <video
     src="src/components/widgets/tradingveiw.mp4"
       autoPlay
       loop
       muted
       playsInline
      className="w-full h-auto mt-2 rounded-lg"
     / >
</div>

    
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="forex" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Forex
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MarketOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Stock Market Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <StockHeatmap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Cryptocurrency Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <CryptoHeatmap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forex" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Forex Market Screener</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <ForexScreener />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <StockAnalyzer />
          </TabsContent>
        </Tabs>
      </main>
      
    </div>
    
  );
}