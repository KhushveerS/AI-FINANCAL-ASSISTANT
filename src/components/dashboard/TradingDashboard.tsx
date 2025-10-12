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
          <a href="#" className="hover:text-yellow-500 transition">Loved by world's best fintech</a>
        </div>

        {/* Right side (copyright + socials) */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-center md:text-right text-2xl font-bold text-white hover:text-blue-500 transition">
            © {new Date().getFullYear()} Financial AI Assistant. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2 text-2xl font-bold text-white">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
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