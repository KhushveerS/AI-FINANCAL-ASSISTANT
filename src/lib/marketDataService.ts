/**
 * Market Data Service
 * Fetches real-time stock and crypto market data, top gainers/losers, and news
 */

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'C7YW81T678JEUQ47';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

export interface MarketPerformer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  sector?: string;
  category?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  url: string;
  description?: string;
  publishedAt: string;
}

/**
 * Fetch real-time stock quote
 */
async function fetchStockQuote(symbol: string): Promise<any> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data['Error Message'] || data['Note']) return null;

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;

    return {
      symbol: symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      volume: parseInt(quote['06. volume'] || '0'),
      high: parseFloat(quote['03. high'] || '0'),
      low: parseFloat(quote['04. low'] || '0'),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch company overview for name and sector
 */
async function fetchCompanyOverview(symbol: string): Promise<any> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data['Error Message'] || data['Note']) return null;

    return {
      name: data.Name || symbol,
      sector: data.Sector || 'Unknown',
      marketCap: data.MarketCapitalization || '0',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Fetch real-time stock market data for top gainers and losers
 */
export async function fetchStockMarketData(): Promise<{
  gainers: MarketPerformer[];
  losers: MarketPerformer[];
}> {
  const popularSymbols = [
    'AAPL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'BAC', 'WMT', 'JNJ', 'V', 'PG', 'MA', 'DIS', 'NKE', 'HD',
    'PYPL', 'CRM', 'ORCL', 'ADBE', 'CSCO', 'IBM', 'QCOM', 'TXN', 'AVGO', 'MU'
  ];

  const performers: MarketPerformer[] = [];

  // Fetch data for all symbols (with delay to avoid rate limits)
  for (let i = 0; i < popularSymbols.length; i++) {
    const symbol = popularSymbols[i];
    
    // Add delay between requests
    if (i > 0 && i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      const [quote, overview] = await Promise.all([
        fetchStockQuote(symbol),
        fetchCompanyOverview(symbol)
      ]);

      if (quote) {
        performers.push({
          symbol: symbol,
          name: overview?.name || symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume.toLocaleString(),
          marketCap: overview?.marketCap ? `$${(parseFloat(overview.marketCap) / 1000000000).toFixed(1)}B` : undefined,
          sector: overview?.sector || 'Unknown',
        });
      }
    } catch (error) {
      console.error(`Error processing ${symbol}:`, error);
    }
  }

  // Sort by change percent
  const sorted = performers.sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    gainers: sorted.slice(0, 10),
    losers: sorted.slice(-10).reverse(),
  };
}

/**
 * Fetch crypto market data using CoinGecko API (free, no key needed)
 */
export async function fetchCryptoMarketData(): Promise<{
  gainers: MarketPerformer[];
  losers: MarketPerformer[];
  trending: MarketPerformer[];
}> {
  try {
    // Fetch top 100 cryptocurrencies by market cap
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();

    const performers: MarketPerformer[] = data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: `$${(coin.total_volume / 1000000).toFixed(1)}M`,
      marketCap: `$${(coin.market_cap / 1000000000).toFixed(1)}B`,
      category: coin.categories?.[0] || 'Cryptocurrency',
    }));

    // Sort by 24h change
    const sorted = performers.sort((a, b) => b.changePercent - a.changePercent);

    // Get trending coins (top by volume)
    const trending = [...performers]
      .sort((a, b) => parseFloat(b.volume.replace('$', '').replace('M', '')) - parseFloat(a.volume.replace('$', '').replace('M', '')))
      .slice(0, 5);

    return {
      gainers: sorted.slice(0, 10),
      losers: sorted.slice(-10).reverse(),
      trending,
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

/**
 * Fetch real news articles
 */
export async function fetchMarketNews(query: string = 'stock market'): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];

  // Try NewsAPI first
  if (NEWS_API_KEY) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.articles) {
          return data.articles.map((article: any, index: number) => ({
            id: `news-${index}`,
            title: article.title,
            source: article.source?.name || 'Unknown',
            timestamp: formatTimestamp(article.publishedAt),
            sentiment: analyzeSentiment(article.title, article.description),
            impact: determineImpact(article.title, article.description),
            url: article.url,
            description: article.description,
            publishedAt: article.publishedAt,
          }));
        }
      }
    } catch (error) {
      console.error('NewsAPI error:', error);
    }
  }

  // Fallback to Alpha Vantage News & Sentiment
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,TSLA,MSFT&limit=10&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.feed) {
        return data.feed.map((item: any, index: number) => ({
          id: `news-${index}`,
          title: item.title,
          source: item.source || 'Unknown',
          timestamp: formatTimestamp(item.time_published),
          sentiment: item.overall_sentiment_label?.toLowerCase() || 'neutral',
          impact: determineImpact(item.title, item.summary),
          url: item.url,
          description: item.summary,
          publishedAt: item.time_published,
        }));
      }
    }
  } catch (error) {
    console.error('Alpha Vantage News error:', error);
  }

  return articles;
}

/**
 * Fetch crypto news
 */
export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  return fetchMarketNews('cryptocurrency bitcoin ethereum');
}

/**
 * Analyze sentiment from text
 */
function analyzeSentiment(title: string, description?: string): 'positive' | 'negative' | 'neutral' {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  const positiveWords = ['surge', 'rally', 'gain', 'rise', 'up', 'bullish', 'growth', 'profit', 'success', 'approval', 'adoption'];
  const negativeWords = ['drop', 'fall', 'decline', 'crash', 'down', 'bearish', 'loss', 'concern', 'risk', 'ban', 'regulation'];
  
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Determine impact level
 */
function determineImpact(title: string, description?: string): 'high' | 'medium' | 'low' {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  const highImpactWords = ['fed', 'federal reserve', 'rate', 'inflation', 'recession', 'crisis', 'approval', 'regulation', 'ban'];
  const mediumImpactWords = ['earnings', 'quarterly', 'merger', 'acquisition', 'partnership', 'launch'];
  
  if (highImpactWords.some(word => text.includes(word))) return 'high';
  if (mediumImpactWords.some(word => text.includes(word))) return 'medium';
  return 'low';
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}

