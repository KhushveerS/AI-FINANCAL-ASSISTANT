import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import StocksPage from "./pages/dashboard/Stocks";
import CryptoPage from "./pages/dashboard/Crypto";
import ForexPage from "./pages/dashboard/Forex";
import ETFPage from "./pages/dashboard/ETF";
import ChartsPage from "./pages/dashboard/Charts";
import AnalysisPage from "./pages/dashboard/Analysis";
import StockAnalysisPage from "./pages/dashboard/StockAnalysis";
import NewsPage from "./pages/dashboard/News";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/dashboard/stocks" element={<StocksPage />} />
          <Route path="/dashboard/crypto" element={<CryptoPage />} />
          <Route path="/dashboard/forex" element={<ForexPage />} />
          <Route path="/dashboard/etf" element={<ETFPage />} />
          <Route path="/dashboard/charts" element={<ChartsPage />} />
          <Route path="/dashboard/analysis" element={<AnalysisPage />} />
          <Route path="/dashboard/stock-analysis" element={<StockAnalysisPage/>} />
          <Route path="/dashboard/news" element={<NewsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;