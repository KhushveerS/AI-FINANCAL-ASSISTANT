import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CryptoHeatmap from "@/components/widgets/CryptoHeatmap";
import Navbar from "@/components/dashboard/Navbar";
import { useState, useEffect } from "react";
import { Search, TrendingUp, AlertTriangle, DollarSign, BarChart3, Flame, Trophy, TrendingDown, Clock, Zap, ArrowUp, ArrowDown, Bitcoin, Coins, Sparkles } from "lucide-react";

interface CryptoAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyMetrics: {
    marketCap: string;
    volume24h: string;
    circulatingSupply: string;
    totalSupply: string;
    allTimeHigh: number;
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
  marketCap: string;
  category: string;
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

export default function CryptoPage() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<CryptoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topGainers, setTopGainers] = useState<TopPerformer[]>([]);
  const [topLosers, setTopLosers] = useState<TopPerformer[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'analysis'>('heatmap');
  const [trendingCoins, setTrendingCoins] = useState<TopPerformer[]>([]);

  // Mock data for crypto performers
  const generateMockCryptoPerformers = (count: number, type: 'gainers' | 'losers') => {
    const categories = ['DeFi', 'NFT', 'Layer 1', 'Layer 2', 'Meme', 'AI', 'Gaming', 'Privacy'];
    const cryptoData = [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'BNB', name: 'Binance Coin' },
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'XRP', name: 'Ripple' },
      { symbol: 'ADA', name: 'Cardano' },
      { symbol: 'DOGE', name: 'Dogecoin' },
      { symbol: 'DOT', name: 'Polkadot' },
      { symbol: 'AVAX', name: 'Avalanche' },
      { symbol: 'LINK', name: 'Chainlink' },
      { symbol: 'MATIC', name: 'Polygon' },
      { symbol: 'LTC', name: 'Litecoin' }
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const crypto = cryptoData[i % cryptoData.length];
      const price = Math.random() * 50000 + 1000;
      const changePercent = type === 'gainers' ? Math.random() * 25 + 5 : -(Math.random() * 20 + 5);
      
      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price: price,
        change: (price * changePercent) / 100,
        changePercent: changePercent,
        volume: `${(Math.random() * 5000 + 500).toFixed(0)}M`,
        marketCap: `$${(Math.random() * 300 + 50).toFixed(0)}B`,
        category: categories[Math.floor(Math.random() * categories.length)]
      };
    });
  };

  // Mock AI suggestions for crypto
  const mockCryptoAiSuggestions: AISuggestion[] = [
    {
      id: '1',
      type: 'buy',
      symbol: 'BTC',
      recommendation: "Bitcoin showing strong accumulation patterns near support levels",
      confidence: 88,
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      type: 'buy',
      symbol: 'ETH',
      recommendation: "Ethereum ecosystem growth accelerating with Layer 2 adoption",
      confidence: 82,
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      type: 'watch',
      symbol: 'SOL',
      recommendation: "Solana network activity increasing, monitor for breakout",
      confidence: 75,
      timestamp: '5 hours ago'
    },
    {
      id: '4',
      type: 'sell',
      symbol: 'DOGE',
      recommendation: "Meme coins showing weakness, consider profit-taking",
      confidence: 70,
      timestamp: '8 hours ago'
    }
  ];

  // Mock crypto news
  const mockCryptoNews: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin ETF Approval Expected to Drive Institutional Adoption',
      source: 'CoinDesk',
      timestamp: '2 hours ago',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      id: '2',
      title: 'Ethereum Dencun Upgrade Goes Live, Reducing Layer 2 Fees',
      source: 'The Block',
      timestamp: '4 hours ago',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      id: '3',
      title: 'Regulatory Concerns Weigh on Crypto Markets',
      source: 'Bloomberg Crypto',
      timestamp: '6 hours ago',
      sentiment: 'negative',
      impact: 'medium'
    },
    {
      id: '4',
      title: 'DeFi Protocol Reaches $10B in Total Value Locked',
      source: 'Decrypt',
      timestamp: '8 hours ago',
      sentiment: 'positive',
      impact: 'medium'
    },
    {
      id: '5',
      title: 'Major Payment Processor Adds Support for Additional Cryptocurrencies',
      source: 'CryptoSlate',
      timestamp: '1 hour ago',
      sentiment: 'positive',
      impact: 'medium'
    }
  ];

  // Mock trending coins
  const mockTrendingCoins: TopPerformer[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 45231.45, change: 1250.67, changePercent: 2.84, volume: '24.5B', marketCap: '886.2B', category: 'Store of Value' },
    { symbol: 'ETH', name: 'Ethereum', price: 2415.78, change: 89.34, changePercent: 3.84, volume: '15.2B', marketCap: '290.3B', category: 'Smart Contract' },
    { symbol: 'SOL', name: 'Solana', price: 102.45, change: 8.23, changePercent: 8.74, volume: '3.2B', marketCap: '44.1B', category: 'Layer 1' },
    { symbol: 'XRP', name: 'Ripple', price: 0.6234, change: 0.0234, changePercent: 3.90, volume: '1.8B', marketCap: '33.7B', category: 'Payments' }
  ];

  useEffect(() => {
    // Initialize with mock data
    setTopGainers(generateMockCryptoPerformers(10, 'gainers'));
    setTopLosers(generateMockCryptoPerformers(10, 'losers'));
    setAiSuggestions(mockCryptoAiSuggestions);
    setMarketNews(mockCryptoNews);
    setTrendingCoins(mockTrendingCoins);
  }, []);

  const analyzeCrypto = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    setActiveTab('analysis');
    
    try {
      // Mock data for crypto analysis
      const mockData: CryptoAnalysis = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Token`,
        currentPrice: Math.random() * 50000 + 1000,
        priceChange: (Math.random() - 0.5) * 2000,
        priceChangePercent: (Math.random() - 0.5) * 15,
        analysis: `Our AI analysis indicates that ${symbol.toUpperCase()} shows strong technical signals with increasing adoption metrics. The token's ecosystem continues to expand with growing developer activity and user adoption.`,
        sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish',
        keyMetrics: {
          marketCap: `$${(Math.random() * 200 + 10).toFixed(2)}B`,
          volume24h: `$${(Math.random() * 5 + 1).toFixed(2)}B`,
          circulatingSupply: `${(Math.random() * 100 + 10).toFixed(0)}M`,
          totalSupply: `${(Math.random() * 150 + 20).toFixed(0)}M`,
          allTimeHigh: Math.random() * 100000 + 50000,
        },
        newsInsights: [
          "Recent protocol upgrade improves scalability and reduces fees",
          "Major exchange listing expected to increase liquidity",
          "Partnership announcement with leading tech company",
          "Growing institutional interest in the token"
        ],
        recommendations: [
          "Consider dollar-cost averaging into positions",
          "Set stop-loss at 15% below current price for risk management",
          "Target price of $" + (Math.random() * 100000 + 50000).toFixed(2) + " within 6 months",
          "Monitor network activity and developer metrics"
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysis(mockData);
    } catch (err) {
      setError('Failed to fetch cryptocurrency analysis. Please try again.');
      console.error('Error analyzing crypto:', err);
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

  const formatPrice = (price: number) => {
    if (price > 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else if (price > 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bitcoin className="w-8 h-8" />
            Cryptocurrency Market
          </h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency prices, trends, and AI-powered market analysis
          </p>
        </div>

        {/* Search and Tabs Section */}
        <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter cryptocurrency symbol (e.g., BTC, ETH, SOL)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeCrypto()}
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                onClick={analyzeCrypto} 
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Analyze Crypto
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
                <Coins className="w-4 h-4" />
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
                Crypto Analysis
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
                    {topGainers.map((crypto, index) => (
                      <div key={crypto.symbol} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{crypto.symbol}</div>
                            <div className="text-xs text-muted-foreground">{crypto.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600 flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            +{crypto.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">{formatPrice(crypto.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending & AI Suggestions */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Crypto Signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">TRENDING COINS</h4>
                    <div className="space-y-2">
                      {trendingCoins.map((coin) => (
                        <div key={coin.symbol} className="flex justify-between items-center p-2 bg-muted/50 rounded bg-gray-900">
                          <div className="flex items-center gap-2 ">
                            <div className="font-semibold text-sm">{coin.symbol}</div>
                            <Badge variant="outline" className="text-xs">{coin.category}</Badge>
                          </div>
                          <div className={`text-sm font-semibold ${coin.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">AI RECOMMENDATIONS</h4>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="p-2 border rounded-lg bg-gray-900">
                          <div className="flex justify-between items-start mb-1 ">
                            <Badge className={getSuggestionColor(suggestion.type)}>
                              {suggestion.type.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-muted-foreground">{suggestion.symbol}</div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{suggestion.recommendation}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span>{suggestion.timestamp}</span>
                            <span className="text-blue-600">{suggestion.confidence}% confidence</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    {topLosers.map((crypto, index) => (
                      <div key={crypto.symbol} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{crypto.symbol}</div>
                            <div className="text-xs text-muted-foreground">{crypto.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600 flex items-center gap-1">
                            <ArrowDown className="w-3 h-3" />
                            {crypto.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">{formatPrice(crypto.price)}</div>
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
                <CardTitle>Cryptocurrency Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <CryptoHeatmap />
              </CardContent>
            </Card>

            {/* Crypto News */}
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Latest Crypto News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
                  {marketNews.map((news) => (
                    <div key={news.id} className="p-4 border rounded-lg bg-gray-900">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getNewsSentimentColor(news.sentiment)}>
                          {news.sentiment}
                        </Badge>
                        <Badge variant="outline" className={getImpactBadge(news.impact)}>
                          {news.impact} impact
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2 text-white">{news.title}</h4>
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
          /* Crypto Analysis Section */
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Crypto Overview */}
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
                        <p className="text-muted-foreground mt-1">{analysis.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{formatPrice(analysis.currentPrice)}</div>
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
                        <span>Market Cap</span>
                        <Badge variant="secondary">{analysis.keyMetrics.marketCap}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>24h Volume</span>
                        <Badge variant="secondary">{analysis.keyMetrics.volume24h}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Circulating Supply</span>
                        <Badge variant="secondary">{analysis.keyMetrics.circulatingSupply}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>All Time High</span>
                        <Badge variant="secondary">{formatPrice(analysis.keyMetrics.allTimeHigh)}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Analysis */}
                  <Card className="lg:col-span-2 bg-gradient-surface border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        AI Analysis & Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-900 leading-relaxed">{analysis.analysis}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Market Insights:</h4>
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
                        <h4 className="font-semibold mb-2">Trading Recommendations:</h4>
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
                  <Bitcoin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyze a Cryptocurrency</h3>
                  <p className="text-muted-foreground">
                    Enter a cryptocurrency symbol above to get AI-powered analysis and market insights
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