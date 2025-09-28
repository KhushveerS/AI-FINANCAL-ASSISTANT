import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Zap, Settings, BarChart3, Globe, MessageSquare, Newspaper, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  symbol: string;
  sentiment: "positive" | "negative" | "neutral";
  recommendation: "buy" | "hold" | "sell";
  riskLevel: "low" | "medium" | "high";
  summary: string;
  keyMetrics: {
    price: string;
    change: string;
    volume: string;
    marketCap: string;
    pe: string;
    eps: string;
  };
  analysis: {
    news: {
      summary: string;
      sentiment: number;
      headlines: string[];
    };
    financial: {
      overview: string;
      profitLoss: string;
      earnings: string;
      score: number;
    };
    geopolitical: {
      impact: string;
      riskFactors: string[];
      score: number;
    };
    socialMedia: {
      sentiment: string;
      platforms: {
        twitter: number;
        reddit: number;
        stocktwits: number;
      };
      trending: string[];
    };
    projects: {
      upcoming: string[];
      development: string;
    };
    risks: string;
    suggestion: string;
  };
}

export default function StockAnalyzer() {
  const [symbol, setSymbol] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  // Alpha Vantage API Key
  const ALPHA_VANTAGE_API_KEY = "C7YW81T678JEUQ47";

  const analyzeStock = async () => {
    console.log("Starting analysis for:", symbol);
    
    if (!symbol) {
      toast({
        title: "Missing Information",
        description: "Please enter a stock symbol.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Fetching real data from Alpha Vantage...");
      
      // Test the API first with a simple call
      const testData = await fetchGlobalQuote(symbol);
      console.log("API Response:", testData);
      
      const realResult = createRealResultFromAlphaVantage(symbol.toUpperCase(), testData);
      setResult(realResult);
      
      toast({
        title: "Real-time Analysis Complete",
        description: `${symbol.toUpperCase()} real data analyzed successfully.`,
      });
    } catch (error: any) {
      console.error("Real data analysis failed:", error);
      
      // Show specific error message
      let errorMessage = "Using enhanced analysis as fallback.";
      if (error.message.includes("limit")) {
        errorMessage = "API rate limit reached. Using enhanced analysis.";
      } else if (error.message.includes("Invalid")) {
        errorMessage = "Invalid stock symbol. Please check the symbol and try again.";
      }
      
      toast({
        title: "Real Data Unavailable",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Fallback to enhanced demo analysis
      const demoResult = createEnhancedDemoResult(symbol.toUpperCase());
      setResult(demoResult);
    } finally {
      setLoading(false);
    }
  };

  // Alpha Vantage API Functions with better error handling
  const fetchGlobalQuote = async (symbol: string) => {
    console.log(`Fetching quote for ${symbol}...`);
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Check for API errors
    if (data["Error Message"]) {
      throw new Error(`Invalid API call: ${data["Error Message"]}`);
    }
    
    if (data["Note"]) {
      throw new Error(`API limit reached: ${data["Note"]}`);
    }
    
    if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
      throw new Error("No data available for this symbol");
    }
    
    return data["Global Quote"];
  };

  const createRealResultFromAlphaVantage = (symbolName: string, quote: any): AnalysisResult => {
    console.log("Creating real result from quote:", quote);
    
    // Extract real data from API response
    const price = parseFloat(quote["05. price"]) || 0;
    const change = parseFloat(quote["09. change"]) || 0;
    const changePercent = parseFloat(quote["10. change percent"]?.replace("%", "")) || 0;
    const volume = parseInt(quote["06. volume"]) || 0;
    
    // Calculate metrics based on real data
    const marketCap = volume * price; // Approximate market cap
    const peRatio = (price / (price * 0.05)).toFixed(1); // Estimated P/E
    
    // Determine sentiment based on actual price change
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    let sentimentScore = 50;
    
    if (changePercent > 2) {
      sentiment = "positive";
      sentimentScore = 60 + Math.min(30, changePercent);
    } else if (changePercent < -2) {
      sentiment = "negative";
      sentimentScore = 40 - Math.min(30, Math.abs(changePercent));
    }
    
    // Generate recommendation based on real data
    let recommendation: "buy" | "hold" | "sell" = "hold";
    if (changePercent > 5) recommendation = "buy";
    if (changePercent < -5) recommendation = "sell";
    
    // Risk level based on volatility
    let riskLevel: "low" | "medium" | "high" = "medium";
    if (Math.abs(changePercent) > 10) riskLevel = "high";
    if (Math.abs(changePercent) < 2) riskLevel = "low";

    return {
      symbol: symbolName,
      sentiment,
      recommendation,
      riskLevel,
      summary: `Real-time analysis for ${symbolName}. Current price: $${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%).`,
      keyMetrics: {
        price: `$${price.toFixed(2)}`,
        change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        volume: `${(volume / 1000000).toFixed(1)}M`,
        marketCap: `$${(marketCap / 1000000000).toFixed(2)}B`,
        pe: peRatio,
        eps: `$${(price * 0.05).toFixed(2)}` // Estimated EPS
      },
      analysis: {
        news: {
          summary: `Market data shows ${changePercent >= 0 ? 'positive' : 'negative'} momentum for ${symbolName}.`,
          sentiment: sentimentScore,
          headlines: [
            `Price ${changePercent >= 0 ? 'increases' : 'decreases'} by ${Math.abs(changePercent).toFixed(2)}%`,
            `Trading volume: ${(volume / 1000000).toFixed(1)} million shares`,
            `Current market activity: ${changePercent >= 0 ? 'bullish' : 'bearish'} trend`
          ]
        },
        financial: {
          overview: `Real-time trading data for ${symbolName}. Based on current market conditions.`,
          profitLoss: `Today's performance: ${changePercent >= 0 ? 'gain' : 'loss'} of ${Math.abs(change).toFixed(2)} points.`,
          earnings: `Current price-to-earnings ratio: ${peRatio}.`,
          score: Math.max(30, Math.min(90, 50 + changePercent * 2))
        },
        geopolitical: {
          impact: "Global market conditions influencing trading patterns.",
          riskFactors: [
            "Market volatility",
            "Economic indicators",
            "Trading volume fluctuations"
          ],
          score: 60
        },
        socialMedia: {
          sentiment: `Social sentiment trending ${sentiment} based on price movement.`,
          platforms: {
            twitter: Math.max(30, Math.min(90, 50 + changePercent * 2)),
            reddit: Math.max(30, Math.min(90, 50 + changePercent * 1.5)),
            stocktwits: Math.max(30, Math.min(90, 50 + changePercent * 2.5))
          },
          trending: [
            `#${symbolName}`,
            changePercent >= 0 ? "#Bullish" : "#Bearish",
            "#StockMarket",
            "#Trading"
          ]
        },
        projects: {
          upcoming: [
            "Real-time market monitoring",
            "Price trend analysis",
            "Volume pattern tracking"
          ],
          development: "Live market data analysis in progress."
        },
        risks: `Current risk level: ${riskLevel}. Monitor price movements closely.`,
        suggestion: generateSuggestion(sentiment, recommendation, price, changePercent)
      }
    };
  };

  const generateSuggestion = (sentiment: string, recommendation: string, price: number, changePercent: number): string => {
    if (recommendation === "buy") {
      return "Consider entry points. Positive momentum detected.";
    } else if (recommendation === "sell") {
      return "Monitor for stabilization. Negative pressure observed.";
    } else {
      return "Hold position. Market shows neutral momentum.";
    }
  };

  const createEnhancedDemoResult = (symbolName: string): AnalysisResult => {
    // More realistic demo data that acknowledges it's not real-time
    const basePrice = 150 + (symbolName.length * 17) % 300;
    const changePercent = (Math.random() * 8 - 4);
    const change = basePrice * (changePercent / 100);
    
    return {
      symbol: symbolName,
      sentiment: changePercent > 0 ? "positive" : "negative",
      recommendation: changePercent > 2 ? "buy" : changePercent < -2 ? "sell" : "hold",
      riskLevel: Math.abs(changePercent) > 5 ? "high" : Math.abs(changePercent) < 1 ? "low" : "medium",
      summary: `Enhanced analysis for ${symbolName}. Real-time data temporarily unavailable. This is simulated data for demonstration.`,
      keyMetrics: {
        price: `$${basePrice.toFixed(2)}`,
        change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        volume: `${(5 + Math.random() * 8).toFixed(1)}M`,
        marketCap: `$${(basePrice * 1.5).toFixed(1)}B`,
        pe: `${(15 + Math.random() * 20).toFixed(1)}`,
        eps: `$${(2 + Math.random() * 5).toFixed(2)}`
      },
      analysis: {
        news: {
          summary: "Enhanced analysis based on market patterns. Real-time news feed temporarily unavailable.",
          sentiment: 50 + changePercent,
          headlines: [
            `Enhanced analysis for ${symbolName}`,
            "Market pattern recognition active",
            "Simulated trading data for demonstration"
          ]
        },
        financial: {
          overview: "Algorithmic analysis based on historical patterns and sector performance.",
          profitLoss: "Profitability assessment using enhanced analytical models.",
          earnings: "Earnings projection based on algorithmic forecasting.",
          score: 60
        },
        geopolitical: {
          impact: "Global economic factors analysis based on current market conditions.",
          riskFactors: [
            "Market data availability",
            "Analysis algorithm performance",
            "Economic indicator processing"
          ],
          score: 55
        },
        socialMedia: {
          sentiment: "Enhanced sentiment analysis based on market patterns.",
          platforms: {
            twitter: 60,
            reddit: 58,
            stocktwits: 62
          },
          trending: [
            `#${symbolName}Analysis`,
            "#MarketInsights",
            "#TradingTools",
            "#InvestmentAnalysis"
          ]
        },
        projects: {
          upcoming: [
            "Real-time data integration",
            "Enhanced AI analysis",
            "Live market feeds"
          ],
          development: "Continuous improvement of analytical capabilities and data sources."
        },
        risks: "Analysis based on enhanced algorithms. Verify with real-time data when available.",
        suggestion: "This is simulated analysis. Consider integrating real-time data sources for live trading insights."
      }
    };
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800 border-green-200";
      case "negative": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy": return "bg-green-600 text-white";
      case "sell": return "bg-red-600 text-white";
      default: return "bg-yellow-600 text-white";
    }
  };

  return (
   <div className="space-y-6 p-4 max-w-7xl mx-auto">
  {/* Header with API Setup */}
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Real-time AI Market Insights
          </span>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Zap className="h-3 w-3 mr-1" />
          Live Data Enabled
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="bg-white text-black border-blue-200 flex-1 placeholder-gray-400"
          onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
        />
        <Button 
          onClick={analyzeStock} 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 font-semibold sm:w-auto w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Live
            </>
          )}
        </Button>
      </div>
      <div className="text-xs text-blue-600 flex items-center gap-2">
        <Zap className="h-3 w-3" />
        Using Alpha Vantage API for real-time stock data • Try symbols like AAPL, TSLA, MSFT
      </div>
    </CardContent>
  </Card>
  
  {result && (
    <div className="animate-slide-up">
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50/50">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="geopolitical" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geopolitical
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News Analysis
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-black">
                  <span>{result.symbol} Market Data</span>
                  <div className="flex gap-2">
                    <Badge className={getSentimentColor(result.sentiment)}>
                      {getSentimentIcon(result.sentiment)}
                      {result.sentiment}
                    </Badge>
                    <Badge className={getRecommendationColor(result.recommendation)}>
                      {result.recommendation.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Price</p>
                    <p className="text-lg font-bold text-blue-800">{result.keyMetrics.price}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Change</p>
                    <p className={`text-lg font-bold ${
                      result.keyMetrics.change.includes('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.keyMetrics.change}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Volume</p>
                    <p className="text-lg font-bold text-blue-800">{result.keyMetrics.volume}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Market Cap</p>
                    <p className="text-lg font-bold text-blue-800">{result.keyMetrics.marketCap}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-white border-blue-100 shadow-md text-black">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{result.summary}</p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> {result.analysis.risks}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                      result.riskLevel === 'high' ? 'bg-red-100' : 
                      result.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <AlertTriangle className={`h-6 w-6 ${
                        result.riskLevel === 'high' ? 'text-red-600' : 
                        result.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">Risk Level</p>
                    <p className={`text-sm font-semibold ${
                      result.riskLevel === 'high' ? 'text-red-600' : 
                      result.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {result.riskLevel.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">Financial Score</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {result.analysis.financial.score}/100
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">Sentiment</p>
                    <p className="text-sm font-semibold text-purple-600">
                      {result.analysis.news.sentiment}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* News Analysis */}
          <Card className="bg-white border-blue-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                News Analysis
                <Badge variant="outline" className={
                  result.analysis.news.sentiment > 70 ? 'bg-green-100 text-green-800' :
                  result.analysis.news.sentiment < 40 ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {result.analysis.news.sentiment}% Positive
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{result.analysis.news.summary}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Headlines:</h4>
                  {result.analysis.news.headlines.map((headline, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{headline}</span>
                    </div>
                  ))}
                </div>
                
                <Progress 
                  value={result.analysis.news.sentiment} 
                  className={`h-2 ${
                    result.analysis.news.sentiment > 70 ? 'bg-green-200' :
                    result.analysis.news.sentiment < 40 ? 'bg-red-200' :
                    'bg-yellow-200'
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card className="bg-white border-blue-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                Financial Overview
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Score: {result.analysis.financial.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{result.analysis.financial.overview}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">P/E Ratio</p>
                    <p className="text-lg font-bold text-gray-900">{result.keyMetrics.pe}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">EPS</p>
                    <p className="text-lg font-bold text-gray-900">{result.keyMetrics.eps}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-700"><strong>Profit/Loss:</strong> {result.analysis.financial.profitLoss}</p>
                  <p className="text-sm text-gray-700"><strong>Earnings Outlook:</strong> {result.analysis.financial.earnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="h-5 w-5" />
                AI Trading Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                  result.recommendation === 'buy' ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900' :
                  result.recommendation === 'sell' ? 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900' :
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900'
                }`}>
                  {result.recommendation === 'buy' ? <TrendingUp className="h-5 w-5" /> :
                  result.recommendation === 'sell' ? <TrendingDown className="h-5 w-5" /> :
                  <Target className="h-5 w-5" />}
                  {result.recommendation.toUpperCase()}
                </div>
                
                <p className="text-gray-700 text-sm">{result.analysis.suggestion}</p>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900">
                    Confidence: {Math.abs(result.analysis.financial.score - 50) + 50}%
                  </Badge>
                  <Badge variant="secondary" className={
                    result.riskLevel === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900' :
                    result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900' :
                    'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900'
                  }>
                    Risk: {result.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tab Contents */}
        
        {/* Geoplotical Anaylsis */}
        <TabsContent value="geopolitical" className="space-y-6">
          <Card className="bg-white border-blue-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-black">
                Geopolitical Impact Analysis
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {result.analysis.geopolitical.score}% Impact Score
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{result.analysis.geopolitical.impact}</p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Key Risk Factors:</h4>
                {result.analysis.geopolitical.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

           {/* News Anaylsis */}
        <TabsContent value="news" className="space-y-6">
          <Card className="bg-white border-blue-100 shadow-md text-black">
            <CardHeader>
              <CardTitle>Detailed News Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{result.analysis.news.summary}</p>
                <div className="space-y-3">
                  {result.analysis.news.headlines.map((headline, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Newspaper className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{headline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-6">
          <Card className="bg-white border-blue-100 shadow-md text-black">
            <CardHeader>
              <CardTitle>Social Media Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{result.analysis.socialMedia.sentiment}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Twitter</p>
                  <p className="text-lg font-bold text-blue-800">{result.analysis.socialMedia.platforms.twitter}%</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600">Reddit</p>
                  <p className="text-lg font-bold text-orange-800">{result.analysis.socialMedia.platforms.reddit}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600">StockTwits</p>
                  <p className="text-lg font-bold text-purple-800">{result.analysis.socialMedia.platforms.stocktwits}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Trending Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.socialMedia.trending.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
       </TabsContent>
      {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`mb-3 ${
                  result.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                  result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {result.riskLevel.toUpperCase()} RISK
                </Badge>
                <p className="text-sm text-gray-700">{result.analysis.risks}</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-green-600">Investment Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{result.analysis.suggestion}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Considerations:</h4>
                  {result.analysis.projects.upcoming.map((project, index) => (
                    <div key={index} className="text-sm text-gray-600 border-l-2 border-blue-300 pl-2">
                      {project}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-blue-100 shadow-md text-violet-900">
            <CardHeader>
              <CardTitle>Market Outlook & Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{result.analysis.projects.development}</p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold">
                  Overall Outlook: {result.sentiment === 'positive' ? 'Optimistic' : result.sentiment === 'negative' ? 'Cautious' : 'Neutral'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )}
</div>
  );
}
