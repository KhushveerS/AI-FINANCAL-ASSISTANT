import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Add missing icon import
import { Calendar, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/dashboard/Navbar";
import NewsFeed from "@/components/widgets/NewsFeed";
import { useState, useEffect } from "react";
import { Search, Filter, Clock, TrendingUp, AlertTriangle, Building2, Users, Zap, Bookmark, Share2, ExternalLink, Eye, MessageCircle } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  timestamp: string;
  category: 'market' | 'earnings' | 'economy' | 'crypto' | 'forex' | 'commodities' | 'policy';
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  tags: string[];
  readTime: string;
  views: number;
  comments: number;
  imageUrl?: string;
  institution: string;
  institutionType: 'bank' | 'hedge-fund' | 'research' | 'media' | 'government';
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // Mock data from top institutions and hedge funds
  const mockNewsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Federal Reserve Holds Rates Steady, Signals Gradual Tightening Path',
      summary: 'The Federal Reserve maintained interest rates but surprised markets with hawkish dot plot projections for 2024.',
      content: 'In a closely watched decision, the Federal Open Market Committee voted to maintain the federal funds rate at 5.25-5.50%. However, the updated dot plot showed committee members projecting fewer rate cuts than previously expected...',
      source: 'Federal Reserve',
      author: 'Jerome Powell',
      timestamp: '2 hours ago',
      category: 'policy',
      sentiment: 'neutral',
      impact: 'high',
      tags: ['FOMC', 'Interest Rates', 'Monetary Policy', 'USD'],
      readTime: '4 min read',
      views: 12450,
      comments: 342,
      institution: 'Federal Reserve',
      institutionType: 'government'
    },
    {
      id: '2',
      title: 'Goldman Sachs: AI Investment Cycle to Drive Tech Earnings Surge',
      summary: 'Goldman Sachs research indicates AI infrastructure spending could add 15% to tech sector earnings in 2024.',
      content: 'Our analysis shows that the AI investment cycle is accelerating faster than expected, with cloud providers and semiconductor companies leading the charge. We expect this to translate into significant earnings upside...',
      source: 'Goldman Sachs Research',
      author: 'David Kostin',
      timestamp: '4 hours ago',
      category: 'market',
      sentiment: 'positive',
      impact: 'high',
      tags: ['AI', 'Technology', 'Earnings', 'Investment'],
      readTime: '6 min read',
      views: 8920,
      comments: 218,
      institution: 'Goldman Sachs',
      institutionType: 'bank'
    },
    {
      id: '3',
      title: 'Bridgewater Associates Warns of Market Complacency in Equity Valuations',
      summary: 'Ray Dalio\'s Bridgewater sees stretched valuations and recommends defensive positioning.',
      content: 'Current equity market valuations appear disconnected from underlying economic fundamentals. Our risk parity models suggest investors should consider increasing exposure to non-correlated assets...',
      source: 'Bridgewater Daily Observations',
      author: 'Ray Dalio',
      timestamp: '6 hours ago',
      category: 'market',
      sentiment: 'negative',
      impact: 'medium',
      tags: ['Valuations', 'Risk', 'Portfolio', 'Defensive'],
      readTime: '5 min read',
      views: 7560,
      comments: 189,
      institution: 'Bridgewater Associates',
      institutionType: 'hedge-fund'
    },
    {
      id: '4',
      title: 'J.P. Morgan: Energy Sector Poised for Rebound as Supply Tightens',
      summary: 'J.P. Morgan analysts predict 25% upside in energy stocks amid production cuts and rising demand.',
      content: 'Structural supply constraints combined with seasonal demand increases create a favorable setup for energy equities. Our top picks include companies with strong free cash flow and dividend growth...',
      source: 'J.P. Morgan Energy Weekly',
      author: 'Christyan Malek',
      timestamp: '8 hours ago',
      category: 'commodities',
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Energy', 'Oil', 'Dividends', 'Sector Rotation'],
      readTime: '3 min read',
      views: 5430,
      comments: 127,
      institution: 'J.P. Morgan',
      institutionType: 'bank'
    },
    {
      id: '5',
      title: 'Renaissance Technologies Q4 Portfolio Update Reveals New AI Positions',
      summary: 'The quant giant increased exposure to semiconductor and cloud computing names.',
      content: 'Latest 13F filings show Renaissance Technologies establishing new positions in several AI infrastructure companies while reducing exposure to traditional retail and consumer staples...',
      source: 'SEC Filings Analysis',
      author: 'Jim Simons',
      timestamp: '1 day ago',
      category: 'market',
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Quant', '13F', 'AI', 'Portfolio'],
      readTime: '4 min read',
      views: 11200,
      comments: 298,
      institution: 'Renaissance Technologies',
      institutionType: 'hedge-fund'
    },
    {
      id: '6',
      title: 'BlackRock Investment Institute: The Case for International Diversification',
      summary: 'BlackRock recommends increasing allocation to non-US markets amid dollar weakness.',
      content: 'With the US dollar showing signs of peak strength, we believe international equities offer compelling valuation opportunities. Emerging markets particularly attractive given growth differentials...',
      source: 'BlackRock Investment Institute',
      author: 'Larry Fink',
      timestamp: '1 day ago',
      category: 'market',
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Diversification', 'International', 'EM', 'Valuations'],
      readTime: '5 min read',
      views: 6780,
      comments: 156,
      institution: 'BlackRock',
      institutionType: 'research'
    },
    {
      id: '7',
      title: 'Citadel Securities Reports Record Q4 Trading Volumes',
      summary: 'Market making giant sees 45% increase in fixed income and commodities trading.',
      content: 'Citadel Securities, the market making arm of Ken Griffin\'s financial empire, reported exceptional Q4 results driven by volatility in bond markets and increased commodity trading activity...',
      source: 'Financial Times',
      author: 'Ken Griffin',
      timestamp: '2 days ago',
      category: 'market',
      sentiment: 'positive',
      impact: 'low',
      tags: ['Trading', 'Volumes', 'Market Making', 'Performance'],
      readTime: '3 min read',
      views: 4320,
      comments: 89,
      institution: 'Citadel',
      institutionType: 'hedge-fund'
    },
    {
      id: '8',
      title: 'Morgan Stanley: Crypto Winter Thawing as Institutional Adoption Grows',
      summary: 'Morgan Stanley research shows increasing institutional allocation to digital assets.',
      content: 'Our latest survey of institutional investors indicates growing comfort with crypto exposure, particularly through regulated vehicles like futures ETFs and structured products...',
      source: 'Morgan Stanley Digital Assets',
      author: 'Sheena Shah',
      timestamp: '2 days ago',
      category: 'crypto',
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Crypto', 'Bitcoin', 'ETF', 'Institutional'],
      readTime: '4 min read',
      views: 8910,
      comments: 234,
      institution: 'Morgan Stanley',
      institutionType: 'bank'
    },
    {
      id: '9',
      title: 'Two Sigma: Machine Learning Models Signal Value in Small Cap Stocks',
      summary: 'Quant fund\'s AI systems identify mispricing opportunities in small and mid-cap space.',
      content: 'Our machine learning algorithms are detecting unusual patterns in small cap stock behavior that suggest potential alpha generation opportunities. The models combine fundamental, technical...',
      source: 'Two Sigma Insights',
      author: 'John Overdeck',
      timestamp: '3 days ago',
      category: 'market',
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Quant', 'AI', 'Small Caps', 'Alpha'],
      readTime: '6 min read',
      views: 5670,
      comments: 143,
      institution: 'Two Sigma',
      institutionType: 'hedge-fund'
    },
    {
      id: '10',
      title: 'Bank of America: Yield Curve Inversion Signals Caution for 2024',
      summary: 'BofA analysts warn that persistent yield curve inversion historically precedes economic slowdown.',
      content: 'The continued inversion of the 2s10s Treasury yield curve, now in its longest stretch in decades, suggests market participants are pricing in economic weakness ahead...',
      source: 'Bank of America Merrill Lynch',
      author: 'Michael Hartnett',
      timestamp: '3 days ago',
      category: 'economy',
      sentiment: 'negative',
      impact: 'high',
      tags: ['Yield Curve', 'Recession', 'Bonds', 'Economy'],
      readTime: '5 min read',
      views: 7650,
      comments: 198,
      institution: 'Bank of America',
      institutionType: 'bank'
    },
    {
      id: '11',
      title: 'Point72 Asset Management Increases Short Position in Commercial Real Estate',
      summary: 'Steve Cohen\'s firm betting against commercial real estate amid office space downturn.',
      content: 'Recent regulatory filings reveal Point72 has significantly increased its short exposure to commercial real estate investment trusts and related derivatives...',
      source: 'SEC Filings',
      author: 'Steve Cohen',
      timestamp: '4 days ago',
      category: 'market',
      sentiment: 'negative',
      impact: 'medium',
      tags: ['Short', 'Real Estate', 'REITs', 'Bearish'],
      readTime: '3 min read',
      views: 6540,
      comments: 167,
      institution: 'Point72',
      institutionType: 'hedge-fund'
    },
    {
      id: '12',
      title: 'European Central Bank Maintains Hawkish Stance Despite Growth Concerns',
      summary: 'ECB President Lagarde emphasizes data dependency amid mixed economic signals.',
      content: 'The European Central Bank left interest rates unchanged but President Lagarde stressed that the fight against inflation is not yet won, pushing back against market expectations for early rate cuts...',
      source: 'European Central Bank',
      author: 'Christine Lagarde',
      timestamp: '4 days ago',
      category: 'policy',
      sentiment: 'neutral',
      impact: 'high',
      tags: ['ECB', 'Euro', 'Inflation', 'Monetary Policy'],
      readTime: '4 min read',
      views: 5430,
      comments: 132,
      institution: 'European Central Bank',
      institutionType: 'government'
    }
  ];

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'market', name: 'Markets' },
    { id: 'earnings', name: 'Earnings' },
    { id: 'economy', name: 'Economy' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'forex', name: 'Forex' },
    { id: 'commodities', name: 'Commodities' },
    { id: 'policy', name: 'Policy' }
  ];

  const institutions = [
    { id: 'all', name: 'All Institutions' },
    { id: 'bank', name: 'Investment Banks' },
    { id: 'hedge-fund', name: 'Hedge Funds' },
    { id: 'research', name: 'Research Firms' },
    { id: 'government', name: 'Central Banks' }
  ];

  useEffect(() => {
    setArticles(mockNewsArticles);
    setFilteredArticles(mockNewsArticles);
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, selectedInstitution, articles]);

  const filterArticles = () => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedInstitution !== 'all') {
      filtered = filtered.filter(article => article.institutionType === selectedInstitution);
    }

    setFilteredArticles(filtered);
  };

  const toggleBookmark = (articleId: string) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
    } else {
      newBookmarked.add(articleId);
    }
    setBookmarked(newBookmarked);
  };

  const getInstitutionColor = (type: string) => {
    switch (type) {
      case 'bank': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hedge-fund': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'research': return 'bg-green-100 text-green-800 border-green-200';
      case 'government': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Zap className="w-4 h-4 text-blue-600" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Institutional News Hub
          </h1>
          <p className="text-muted-foreground">
            Exclusive insights from top investment banks, hedge funds, and financial institutions
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news, tags, or institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button variant="outline" className="h-12 px-6">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {institutions.map((institution) => (
                  <Button
                    key={institution.id}
                    variant={selectedInstitution === institution.id ? "default" : "outline"}
                    onClick={() => setSelectedInstitution(institution.id)}
                    className="whitespace-nowrap"
                  >
                    {institution.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main News Feed */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Latest Institutional Insights</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {filteredArticles.length} articles
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-6 p-6">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getInstitutionColor(article.institutionType)}>
                            {article.institution}
                          </Badge>
                          <Badge variant="outline" className={getImpactBadge(article.impact)}>
                            {article.impact} impact
                          </Badge>
                          {getSentimentIcon(article.sentiment)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(article.id)}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${bookmarked.has(article.id) ? 'fill-current text-yellow-500' : ''}`} 
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-3">{article.summary}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.timestamp}</span>
                          </div>
                          <span>•</span>
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>By {article.author}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Institutions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Goldman Sachs', articles: 12, trend: 'up' },
                    { name: 'Bridgewater', articles: 8, trend: 'up' },
                    { name: 'J.P. Morgan', articles: 10, trend: 'stable' },
                    { name: 'BlackRock', articles: 7, trend: 'up' },
                    { name: 'Morgan Stanley', articles: 6, trend: 'down' }
                  ].map((institution, index) => (
                    <div key={institution.name} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{institution.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {institution.articles}
                        </Badge>
                      </div>
                      {institution.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : institution.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Zap className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Pulse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Market Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { metric: 'S&P 500', value: '+1.2%', sentiment: 'positive' },
                    { metric: 'NASDAQ', value: '+2.1%', sentiment: 'positive' },
                    { metric: 'VIX Index', value: '-0.8%', sentiment: 'positive' },
                    { metric: 'USD Index', value: '-0.3%', sentiment: 'negative' },
                    { metric: 'Oil Prices', value: '+1.5%', sentiment: 'positive' }
                  ].map((item) => (
                    <div key={item.metric} className="flex justify-between items-center">
                      <span className="text-sm">{item.metric}</span>
                      <Badge variant={item.sentiment === 'positive' ? 'default' : 'destructive'} className="text-xs">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'SEC Filings', icon: ExternalLink },
                    { name: 'Economic Calendar', icon: Calendar },
                    { name: 'Earnings Calendar', icon: TrendingUp },
                    { name: 'Central Bank Events', icon: Building2 }
                  ].map((link) => (
                    <Button key={link.name} variant="ghost" className="w-full justify-start">
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

