import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Zap, BarChart3, Globe, MessageSquare, Newspaper, Brain, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performComprehensiveAnalysis, type ComprehensiveAnalysis } from "@/lib/aiAnalysisService";

export default function StockAnalyzer() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComprehensiveAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeStock = async () => {
    if (!symbol.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a stock symbol.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      toast({
        title: "Analysis Started",
        description: `Analyzing ${symbol.toUpperCase()} with AI... This may take a moment.`,
      });

      const analysis = await performComprehensiveAnalysis(symbol.toUpperCase());
      setResult(analysis);

      toast({
        title: "Analysis Complete",
        description: `Comprehensive AI analysis for ${symbol.toUpperCase()} completed successfully!`,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      let errorMessage = "Failed to analyze stock. ";
      if (error.message?.includes("Gemini API key")) {
        errorMessage += "Please configure VITE_GEMINI_API_KEY in your .env file for AI analysis.";
      } else if (error.message?.includes("limit")) {
        errorMessage += "API rate limit reached. Please try again later.";
      } else if (error.message?.includes("Invalid") || error.message?.includes("No data")) {
        errorMessage += "Invalid stock symbol or no data available.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 60) return "bg-green-100 text-green-800 border-green-200";
    if (sentiment < 40) return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy": return "bg-green-600 text-white";
      case "sell": return "bg-red-600 text-white";
      default: return "bg-yellow-600 text-white";
    }
  };

  const getRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score > 70) return "high";
    if (score < 40) return "low";
    return "medium";
  };

  if (!result) {
    return (
      <div className="space-y-6 p-4 max-w-7xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Stock Analysis
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                Real AI Analysis
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
                onKeyPress={(e) => e.key === 'Enter' && !loading && analyzeStock()}
                disabled={loading}
              />
              <Button 
                onClick={analyzeStock} 
                disabled={loading || !symbol.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 font-semibold sm:w-auto w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-blue-600 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Powered by Google Gemini AI • Real-time market data • News analysis • Social sentiment
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> To enable full AI analysis, configure your API keys in a <code className="bg-blue-100 px-1 rounded">.env</code> file:
              </p>
              <ul className="text-xs text-blue-700 mt-2 list-disc list-inside space-y-1">
                <li><code>VITE_GEMINI_API_KEY</code> - For AI-powered insights (Required for best results)</li>
                <li><code>VITE_ALPHA_VANTAGE_API_KEY</code> - For stock data (Optional, has default)</li>
                <li><code>VITE_NEWS_API_KEY</code> - For news articles (Optional)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskLevel = getRiskLevel(result.geopolitical.score);
  const overallSentiment = result.quote.changePercent > 0 ? "positive" : result.quote.changePercent < 0 ? "negative" : "neutral";

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Analysis: {result.symbol}
              </span>
            </div>
            <div className="flex gap-2">
              <Badge className={getSentimentColor(result.news.sentiment)}>
                {getSentimentIcon(overallSentiment)}
                {overallSentiment}
              </Badge>
              <Badge className={getRecommendationColor(result.recommendation.action)}>
                {result.recommendation.action.toUpperCase()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Enter stock symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="bg-white text-black border-blue-200 flex-1"
              onKeyPress={(e) => e.key === 'Enter' && !loading && analyzeStock()}
              disabled={loading}
            />
            <Button 
              onClick={analyzeStock} 
              disabled={loading || !symbol.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Re-analyze
                </>
              )}
            </Button>
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

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Metrics */}
                <Card className="bg-white border-blue-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-black">
                      <span>{result.symbol} Market Data</span>
                      <Badge className={getSentimentColor(result.news.sentiment)}>
                        {result.news.sentiment}% Sentiment
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Price</p>
                        <p className="text-lg font-bold text-blue-800">${result.quote.price.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Change</p>
                        <p className={`text-lg font-bold ${
                          result.quote.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.quote.change >= 0 ? '+' : ''}{result.quote.change.toFixed(2)} ({result.quote.changePercent >= 0 ? '+' : ''}{result.quote.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Volume</p>
                        <p className="text-lg font-bold text-blue-800">{result.quote.volume.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">52W Range</p>
                        <p className="text-lg font-bold text-blue-800">${result.quote.low.toFixed(2)} - ${result.quote.high.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary */}
                <Card className="bg-white border-blue-100 shadow-md text-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{result.aiInsights.summary}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Key Drivers:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {result.aiInsights.keyDrivers.map((driver, idx) => (
                            <li key={idx}>{driver}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Technical Analysis */}
              <Card className="bg-white border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-black">Technical Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{result.aiInsights.technicalAnalysis}</p>
                </CardContent>
              </Card>

              {/* Fundamental Analysis */}
              <Card className="bg-white border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-black">Fundamental Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{result.aiInsights.fundamentalAnalysis}</p>
                </CardContent>
              </Card>

              {/* Market Outlook */}
              <Card className="bg-white border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-black">Market Outlook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{result.aiInsights.marketOutlook}</p>
                </CardContent>
              </Card>

              {/* Risks & Opportunities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-red-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Key Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.aiInsights.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white border-green-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-5 w-5" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.aiInsights.opportunities.map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Geopolitical Tab */}
            <TabsContent value="geopolitical" className="space-y-6">
              {/* Main Impact Card */}
              <Card className="bg-white border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-black">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span>Geopolitical Impact Analysis</span>
                    </div>
                    <Badge variant="outline" className={`${
                      result.geopolitical.score > 70 ? 'bg-red-100 text-red-800 border-red-300' :
                      result.geopolitical.score < 40 ? 'bg-green-100 text-green-800 border-green-300' :
                      'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }`}>
                      Risk Score: {result.geopolitical.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{result.geopolitical.impact}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Risk Factors
                      </h4>
                      <ul className="space-y-2">
                        {result.geopolitical.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Opportunities
                      </h4>
                      <ul className="space-y-2">
                        {result.geopolitical.opportunities.map((opp, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Progress 
                    value={result.geopolitical.score} 
                    className={`h-4 ${
                      result.geopolitical.score > 70 ? 'bg-red-200' :
                      result.geopolitical.score < 40 ? 'bg-green-200' :
                      'bg-yellow-200'
                    }`}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    {result.geopolitical.score > 70 ? 'High Risk' : result.geopolitical.score < 40 ? 'Low Risk' : 'Moderate Risk'}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trade Policy */}
                <Card className="bg-white border-purple-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Trade Policy Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.geopolitical.tradePolicy}</p>
                  </CardContent>
                </Card>

                {/* Regulatory Environment */}
                <Card className="bg-white border-indigo-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Regulatory Environment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.geopolitical.regulatoryEnvironment}</p>
                  </CardContent>
                </Card>

                {/* Currency Impact */}
                <Card className="bg-white border-cyan-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-cyan-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Currency Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.geopolitical.currencyImpact}</p>
                  </CardContent>
                </Card>

                {/* Time Horizon */}
                <Card className="bg-white border-blue-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Impact Time Horizon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 mb-2">
                      {result.geopolitical.timeHorizon}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-2">
                      Expected timeframe when geopolitical factors will most significantly impact this stock
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Specific Events & Regions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-red-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Recent Geopolitical Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.geopolitical.specificEvents.map((event, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{event}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white border-green-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Affected Regions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.geopolitical.regions.map((region, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          {region}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      Primary geographic regions where geopolitical factors are most relevant
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* News Analysis Tab */}
            <TabsContent value="news" className="space-y-6">
              <Card className="bg-white border-blue-100 shadow-md text-black">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>News Analysis</span>
                    <Badge variant="outline" className={getSentimentColor(result.news.sentiment)}>
                      {result.news.sentiment}% Positive
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">{result.news.summary}</p>
                    
                    {result.news.articles.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Recent Articles:</h4>
                        {result.news.articles.slice(0, 10).map((article, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Newspaper className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-700 hover:text-blue-900 flex items-center gap-1"
                              >
                                {article.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              {article.description && (
                                <p className="text-xs text-gray-600 mt-1">{article.description.substring(0, 150)}...</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">{article.source}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(article.publishedAt).toLocaleDateString()}
                                </span>
                                {article.sentiment && (
                                  <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <Badge variant="outline" className={`text-xs ${
                                      article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                      article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {article.sentiment}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No recent news articles found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card className="bg-white border-blue-100 shadow-md text-black">
                <CardHeader>
                  <CardTitle>Social Media Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Overall sentiment: <strong>{result.socialMedia.overall.toFixed(1)}%</strong> positive
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Twitter</p>
                      <p className="text-lg font-bold text-blue-800">{result.socialMedia.twitter.toFixed(1)}%</p>
                      <Progress value={result.socialMedia.twitter} className="mt-2 h-2" />
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Reddit</p>
                      <p className="text-lg font-bold text-orange-800">{result.socialMedia.reddit.toFixed(1)}%</p>
                      <Progress value={result.socialMedia.reddit} className="mt-2 h-2" />
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">StockTwits</p>
                      <p className="text-lg font-bold text-purple-800">{result.socialMedia.stocktwits.toFixed(1)}%</p>
                      <Progress value={result.socialMedia.stocktwits} className="mt-2 h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Trending Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.socialMedia.trending.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              {/* Main Recommendation Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-blue-700">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Trading Recommendation
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Confidence: {result.recommendation.confidence}%
                      </Badge>
                      <Badge variant="secondary" className={
                        riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        Risk: {riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-md ${
                      result.recommendation.action === 'buy' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                      result.recommendation.action === 'sell' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                      'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                      {result.recommendation.action === 'buy' ? <TrendingUp className="h-6 w-6" /> :
                      result.recommendation.action === 'sell' ? <TrendingDown className="h-6 w-6" /> :
                      <Target className="h-6 w-6" />}
                      {result.recommendation.action.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{result.recommendation.reasoning}</p>
                  </div>

                  {/* Price Targets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.recommendation.targetPrice && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-800">Target Price</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          ${result.recommendation.targetPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Potential upside: {((result.recommendation.targetPrice / result.quote.price - 1) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}

                    {result.recommendation.stopLoss && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-red-800">Stop Loss</h4>
                        </div>
                        <p className="text-2xl font-bold text-red-700">
                          ${result.recommendation.stopLoss.toFixed(2)}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Maximum loss: {((1 - result.recommendation.stopLoss / result.quote.price) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Strategy Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entry Strategy */}
                <Card className="bg-white border-green-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Entry Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation.entryStrategy}</p>
                    {result.recommendation.positionSize && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-700 font-semibold mb-1">Recommended Position Size:</p>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {result.recommendation.positionSize}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Exit Strategy */}
                <Card className="bg-white border-orange-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Exit Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation.exitStrategy}</p>
                    {result.recommendation.timeHorizon && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-700 font-semibold mb-1">Recommended Time Horizon:</p>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          {result.recommendation.timeHorizon}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Key Catalysts & Risk Warnings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-blue-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Key Catalysts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendation.keyCatalysts?.map((catalyst, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{catalyst}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      Events or factors that could drive significant price movement
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-red-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendation.riskWarnings?.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      Important risks to monitor before and during the investment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Market Comparison */}
              <Card className="bg-white border-purple-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Market Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation.comparisonToMarket}</p>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-700">Current Price:</span>
                      <span className="text-sm font-semibold text-purple-800">${result.quote.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-purple-700">Price Change:</span>
                      <span className={`text-sm font-semibold ${result.quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.quote.change >= 0 ? '+' : ''}{result.quote.changePercent.toFixed(2)}%
                      </span>
                    </div>
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
