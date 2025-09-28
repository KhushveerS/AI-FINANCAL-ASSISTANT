import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, Globe, Coins, TrendingUp, PieChart, LineChart,Linkedin,Github,Twitter } from "lucide-react";
import StockHeatmap from "@/components/widgets/StockHeatmap";
import CryptoHeatmap from "@/components/widgets/CryptoHeatmap";
import ForexScreener from "@/components/widgets/ForexScreener";
import NewsFeed from "@/components/widgets/NewsFeed";
import TickerTape from "@/components/widgets/TickerTape";
import ETFHeatmap from "@/components/widgets/ETFHeatmap";
import AdvancedChart from "@/components/widgets/AdvancedChart";
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
     >
     Your browser does not support the video tag.
     </video>
</div>

    
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2 hover:text-blue-500 transition">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center gap-2 hover:text-violet-500 transition">
              <BarChart3 className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2 hover:text-cyan-500 transition">
              <Coins className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="forex" className="flex items-center gap-2 hover:text-emerald-500 transition">
              <Globe className="h-4 w-4" />
              Forex
            </TabsTrigger>
            <TabsTrigger value="etf" className="flex items-center gap-2 hover:text-emerald-500 transition">
              <PieChart className="h-4 w-4" />
              ETF
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2 hover:text-green-500 transition">
              <LineChart className="h-4 w-4" />
              Advanced Charts
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2 hover:text-blue-500 transition">
              <TrendingUp className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 ">
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

          <TabsContent value="etf" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>ETF Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <ETFHeatmap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <Card className="bg-gradient-surface border-border/50 shadow-card ">
              <CardHeader>
                <CardTitle>Advanced Charting</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <AdvancedChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <StockAnalyzer />
          </TabsContent>
        </Tabs>
      </main>
      <video
     src="src/components/widgets/part3.mp4"
       autoPlay
       loop
       muted
       playsInline
      className="w-full h-auto mt-2 rounded-lg"
     >
     
     </video>
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm">
        
        {/* Left side (links) */}
        <div className="flex flex-col items-center md:items-start gap-2 mb-4 md:mb-0 text-center md:text-left text-2xl font-bold text-white">
          <a href="#" className="hover:text-cyan-500 transition">Privacy Policy</a>
          <a href="#" className="hover:text-purple-500 transition">Terms of Service</a>
          <a href="#" className="hover:text-pink-500 transition">Contact</a>
        </div>

        {/* Right side (copyright + socials) */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-center md:text-right text-2xl font-bold text-white hover:text-blue-500 transition">
            © {new Date().getFullYear()} Financial AI Assistant. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-2xl font-bold text-white">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/khushveer-singh-b6b888286/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
              <Github className=" h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </div>
    
  );
}