import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/dashboard/Navbar";
import { useState } from "react";
import { Search, TrendingUp, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";

interface StockAnalysis {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyMetrics: {
    peRatio: number;
    marketCap: string;
    dividendYield: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
  };
  newsInsights: string[];
  recommendations: string[];
}

export default function StockAnalysisPage() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeStock = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock data since we don't have a real API
      // In a real application, this would call an actual API
      const mockData: StockAnalysis = {
        symbol: symbol.toUpperCase(),
        companyName: `${symbol.toUpperCase()} Corporation`,
        currentPrice: Math.random() * 500 + 100,
        priceChange: (Math.random() - 0.5) * 20,
        priceChangePercent: (Math.random() - 0.5) * 10,
        analysis: `Our AI analysis indicates that ${symbol.toUpperCase()} shows strong potential for growth based on technical indicators and market sentiment. The company's fundamentals remain solid with consistent revenue growth and a strong balance sheet.`,
        sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish',
        keyMetrics: {
          peRatio: Math.random() * 30 + 10,
          marketCap: `$${(Math.random() * 200 + 50).toFixed(2)}B`,
          dividendYield: Math.random() * 3,
          fiftyTwoWeekHigh: Math.random() * 600 + 200,
          fiftyTwoWeekLow: Math.random() * 200 + 50,
        },
        newsInsights: [
          "Recent earnings beat analyst expectations by 12%",
          "New product launch expected to drive revenue growth",
          "Industry analysts upgraded rating to 'Buy'",
          "Strong performance in international markets"
        ],
        recommendations: [
          "Consider accumulating positions on dips",
          "Set stop-loss at 8% below current price",
          "Target price of $" + (Math.random() * 100 + 200).toFixed(2) + " within 12 months",
          "Monitor upcoming quarterly earnings report"
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysis(mockData);
    } catch (err) {
      setError('Failed to fetch stock analysis. Please try again.');
      console.error('Error analyzing stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            AI Stock Analysis
          </h1>
          <p className="text-muted-foreground">
            Get comprehensive AI-powered analysis combining real-time market data and institutional insights
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                onClick={analyzeStock} 
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Analyze
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Stock Overview */}
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      {analysis.symbol}
                      <Badge className={getSentimentColor(analysis.sentiment)}>
                        {analysis.sentiment.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">{analysis.companyName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${analysis.currentPrice.toFixed(2)}</div>
                    <div className={`text-lg font-semibold ${
                      analysis.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChange.toFixed(2)} (
                      {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChangePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <Card className="lg:col-span-1 bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>P/E Ratio</span>
                    <Badge variant="secondary">{analysis.keyMetrics.peRatio.toFixed(2)}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Market Cap</span>
                    <Badge variant="secondary">{analysis.keyMetrics.marketCap}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Dividend Yield</span>
                    <Badge variant="secondary">{(analysis.keyMetrics.dividendYield * 100).toFixed(2)}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>52W Range</span>
                    <Badge variant="secondary">
                      ${analysis.keyMetrics.fiftyTwoWeekLow.toFixed(2)} - ${analysis.keyMetrics.fiftyTwoWeekHigh.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card className="lg:col-span-2 bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    AI Analysis & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-900 leading-relaxed">{analysis.analysis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">News Insights:</h4>
                    <ul className="space-y-2">
                      {analysis.newsInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Placeholder when no analysis */}
        {!analysis && !loading && (
          <Card className="bg-gradient-surface border-border/50 shadow-card">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enter a Stock Symbol</h3>
              <p className="text-muted-foreground">
                Search for any stock symbol to get AI-powered analysis combining real-time data and market insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}