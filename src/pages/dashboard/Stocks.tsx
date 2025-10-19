import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockHeatmap from "@/components/widgets/StockHeatmap";
import Navbar from "@/components/dashboard/Navbar";
import { useState, useEffect } from "react";
import { Search, TrendingUp, AlertTriangle, DollarSign, BarChart3, Flame, Trophy, TrendingDown, Clock, Zap, ArrowUp, ArrowDown } from "lucide-react";
import axios from 'axios';

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

interface TopPerformer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sector: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

interface AISuggestion {
  id: string;
  type: 'buy' | 'sell' | 'hold' | 'watch';
  symbol: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
}

// Mock data generators
const generateMockPerformers = (count: number, type: 'gainers' | 'losers'): TopPerformer[] => {
  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-Commerce' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
    { symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology' }
  ];

  return mockStocks.slice(0, count).map((stock, index) => ({
    ...stock,
    price: type === 'gainers' ? 150 + (index * 10) : 100 - (index * 5),
    change: type === 'gainers' ? 2 + (index * 0.5) : -2 - (index * 0.5),
    changePercent: type === 'gainers' ? 1.5 + (index * 0.5) : -1.5 - (index * 0.5),
    volume: ((1000000 + index * 100000) * (type === 'gainers' ? 1.5 : 0.8)).toLocaleString()
  }));
};

// Mock data
const mockAiSuggestions: AISuggestion[] = [
  {
    id: '1',
    type: 'buy',
    symbol: 'NVDA',
    recommendation: "Strong buy recommendation based on AI chip demand surge",
    confidence: 92,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'sell',
    symbol: 'TSLA',
    recommendation: "Consider profit-taking amid increased competition in EV space",
    confidence: 78,
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'buy',
    symbol: 'MSFT',
    recommendation: "Cloud services growth accelerating, strong fundamentals",
    confidence: 88,
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    type: 'watch',
    symbol: 'AAPL',
    recommendation: "Monitor upcoming product launch for entry point",
    confidence: 85,
    timestamp: '8 hours ago'
  }
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Fed Holds Rates Steady, Signals Potential Cuts Later This Year',
    source: 'Bloomberg',
    timestamp: '2 hours ago',
    sentiment: 'positive',
    impact: 'high'
  },
  {
    id: '2',
    title: 'Tech Giants Report Strong Quarterly Earnings Amid AI Boom',
    source: 'CNBC',
    timestamp: '4 hours ago',
    sentiment: 'positive',
    impact: 'high'
  },
  {
    id: '3',
    title: 'Oil Prices Volatile Amid Middle East Tensions',
    source: 'Reuters',
    timestamp: '6 hours ago',
    sentiment: 'negative',
    impact: 'medium'
  },
  {
    id: '4',
    title: 'Retail Sales Data Exceeds Expectations',
    source: 'Wall Street Journal',
    timestamp: '8 hours ago',
    sentiment: 'positive',
    impact: 'medium'
  },
  {
    id: '5',
    title: 'AI Chip Demand Drives Semiconductor Stocks to Record Highs',
    source: 'Financial Times',
    timestamp: '1 hour ago',
    sentiment: 'positive',
    impact: 'high'
  }
];

const popularSymbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC'];
const API_KEY = 'C7YW81T678JEUQ47'; // Replace with your actual API key
const API_BASE = 'https://www.alphavantage.co/query';

export default function StocksPage() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topGainers, setTopGainers] = useState<TopPerformer[]>([]);
  const [topLosers, setTopLosers] = useState<TopPerformer[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'analysis'>('heatmap');

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        // Check cache first to avoid API limits
        const cached = localStorage.getItem('topPerformers');
        const cacheTime = localStorage.getItem('topPerformersTime');
        
        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) { // 5 minute cache
          const data = JSON.parse(cached);
          setTopGainers(data.gainers);
          setTopLosers(data.losers);
          return;
        }

        // Sequential requests to avoid rate limits
        const performers = [];
        for (const sym of popularSymbols) {
          try {
            const response = await axios.get(
              `${API_BASE}?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${API_KEY}`
            );
            
            const data = response.data['Global Quote'];
            if (data && data['05. price']) {
              const price = parseFloat(data['05. price']);
              const change = parseFloat(data['09. change']);
              const changePercent = parseFloat(data['10. change percent'].replace('%', ''));
              
              performers.push({
                symbol: sym,
                name: data['01. symbol'], // Using symbol as name fallback
                price,
                change,
                changePercent,
                volume: data['06. volume'],
                sector: 'Technology', // Default sector
              });
            }
            
            // Add delay between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (err) {
            console.warn(`Failed to fetch ${sym}:`, err);
          }
        }

        if (performers.length > 0) {
          const sorted = performers.sort((a, b) => b.changePercent - a.changePercent);
          const gainers = sorted.slice(0, 5);
          const losers = sorted.slice(-5).reverse();
          
          setTopGainers(gainers);
          setTopLosers(losers);
          
          // Cache results
          localStorage.setItem('topPerformers', JSON.stringify({ gainers, losers }));
          localStorage.setItem('topPerformersTime', Date.now().toString());
        } else {
          // Fallback to mock data if API fails
          setTopGainers(generateMockPerformers(5, 'gainers'));
          setTopLosers(generateMockPerformers(5, 'losers'));
        }
      } catch (err) {
        console.error('Failed to fetch performers:', err);
        // Fallback to mock data
        setTopGainers(generateMockPerformers(5, 'gainers'));
        setTopLosers(generateMockPerformers(5, 'losers'));
      }
    };

    fetchTopPerformers();
    setAiSuggestions(mockAiSuggestions);
    setMarketNews(mockNews);

    // Refresh every 5 minutes (respects API limits)
    const interval = setInterval(fetchTopPerformers, 300000);
    return () => clearInterval(interval);
  }, []);

  const analyzeStock = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    setActiveTab('analysis');
    
    try {
      const quoteParams = `function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`;
      const overviewParams = `function=OVERVIEW&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`;
      
      const [quoteRes, overviewRes] = await Promise.all([
        axios.get(`${API_BASE}?${quoteParams}`),
        axios.get(`${API_BASE}?${overviewParams}`)
      ]);
      
      // Check for API errors
      if (quoteRes.data.Note || overviewRes.data.Note) {
        throw new Error('API rate limit reached. Please try again in a minute.');
      }
      
      if (quoteRes.data['Error Message']) {
        throw new Error('Invalid stock symbol. Please check the symbol and try again.');
      }
      
      const quoteData = quoteRes.data['Global Quote'];
      const overviewData = overviewRes.data;
      
      if (!quoteData || Object.keys(quoteData).length === 0) {
        throw new Error('No data found for this symbol. It may be delisted or the symbol may be incorrect.');
      }
      
      const currentPrice = parseFloat(quoteData['05. price']);
      const priceChange = parseFloat(quoteData['09. change']);
      const priceChangePercent = parseFloat(quoteData['10. change percent'].replace('%', ''));
      
      // Enhanced analysis based on real data
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      if (priceChangePercent > 2) sentiment = 'bullish';
      else if (priceChangePercent < -2) sentiment = 'bearish';
      
      const realData: StockAnalysis = {
        symbol: symbol.toUpperCase(),
        companyName: overviewData?.Name || `${symbol.toUpperCase()} Corporation`,
        currentPrice,
        priceChange,
        priceChangePercent,
        analysis: overviewData?.Description 
          ? `Company Overview: ${overviewData.Description.slice(0, 200)}...` 
          : `Current trading at $${currentPrice.toFixed(2)} with ${priceChange >= 0 ? 'gains' : 'losses'} of ${Math.abs(priceChangePercent).toFixed(2)}%.`,
        sentiment,
        keyMetrics: {
          peRatio: parseFloat(overviewData?.PERatio || '0'),
          marketCap: overviewData?.MarketCapitalization 
            ? `$${(parseFloat(overviewData.MarketCapitalization) / 1000000000).toFixed(2)}B`
            : 'N/A',
          dividendYield: parseFloat(overviewData?.DividendYield || '0') * 100,
          fiftyTwoWeekHigh: parseFloat(overviewData?.['52WeekHigh'] || currentPrice.toString()),
          fiftyTwoWeekLow: parseFloat(overviewData?.['52WeekLow'] || currentPrice.toString()),
        },
        newsInsights: [
          `Latest price: $${currentPrice.toFixed(2)} (${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)`,
          `52W Range: $${parseFloat(overviewData?.['52WeekLow'] || currentPrice.toString()).toFixed(2)} - $${parseFloat(overviewData?.['52WeekHigh'] || currentPrice.toString()).toFixed(2)}`,
          `Sector: ${overviewData?.Sector || 'Not specified'}`
        ],
        recommendations: [
          `P/E Ratio: ${parseFloat(overviewData?.PERatio || '0').toFixed(2)} ${parseFloat(overviewData?.PERatio || '0') > 25 ? '(Consider valuation)' : '(Reasonable valuation)'}`,
          `Market Cap: ${overviewData?.MarketCapitalization ? `$${(parseFloat(overviewData.MarketCapitalization) / 1000000000).toFixed(2)}B` : 'N/A'}`,
          `Dividend Yield: ${(parseFloat(overviewData?.DividendYield || '0') * 100).toFixed(2)}%`
        ],
      };
      
      setAnalysis(realData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data. Please try again later.');
      console.error('Analysis error:', err);
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

  const getNewsSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sell': return 'bg-red-100 text-red-800 border-red-200';
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
            Stock Market Analysis
          </h1>
          <p className="text-muted-foreground">
            Real-time stock market heatmaps, AI-powered analysis, and performance data
          </p>
          <div className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Data delayed by 15 minutes for US stocks
          </div>
        </div>

        {/* Search and Tabs Section */}
        <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
                Analyze Stock
              </Button>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex border-b border-border">
              <button
                className={`px-4 py-2 font-medium flex items-center gap-2 ${
                  activeTab === 'heatmap'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('heatmap')}
              >
                <TrendingUp className="w-4 h-4" />
                Market Heatmap
              </button>
              <button
                className={`px-4 py-2 font-medium flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                <BarChart3 className="w-4 h-4" />
                Stock Analysis
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        {activeTab === 'heatmap' ? (
          <>
            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top Gainers */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-5 h-5" />
                    Top Gainers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainers.map((stock, index) => (
                      <div key={stock.symbol} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.sector}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600 flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            +{stock.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">${stock.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    AI Trading Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="p-3 border rounded-lg bg-background/50">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getSuggestionColor(suggestion.type)}>
                            {suggestion.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {suggestion.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="font-semibold mb-1">{suggestion.symbol}</div>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.recommendation}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{suggestion.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                    Top Losers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers.map((stock, index) => (
                      <div key={stock.symbol} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.sector}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600 flex items-center gap-1">
                            <ArrowDown className="w-3 h-3" />
                            {stock.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">${stock.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap Section */}
            <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Stock Market Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <StockHeatmap />
              </CardContent>
            </Card>

            {/* Market News */}
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Latest Market News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketNews.map((news) => (
                    <div key={news.id} className="p-4 border rounded-lg bg-background/50">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getNewsSentimentColor(news.sentiment)}>
                          {news.sentiment}
                        </Badge>
                        <Badge variant="outline" className={getImpactBadge(news.impact)}>
                          {news.impact} impact
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{news.title}</h4>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{news.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Stock Analysis Section */
          <div className="space-y-6">
            {analysis ? (
              <>
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
                        <Badge variant="secondary">{analysis.keyMetrics.dividendYield.toFixed(2)}%</Badge>
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
              </>
            ) : (
              /* Placeholder when no analysis */
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyze a Stock</h3>
                  <p className="text-muted-foreground">
                    Enter a stock symbol above to get AI-powered analysis and insights
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}