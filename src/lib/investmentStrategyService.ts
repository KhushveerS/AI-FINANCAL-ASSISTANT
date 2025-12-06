/**
 * Investment Strategy Service
 * Uses Gemini AI to generate personalized investment strategies based on amount, time, and desired interest
 * Now includes real-time market data for better recommendations
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'C7YW81T678JEUQ47';

export interface InvestmentStrategyRequest {
  amount: number;
  timeMonths: number;
  desiredInterest: number;
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface SectorStrategy {
  sector: string;
  allocation: number; // percentage
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string;
  specificRecommendations: string[];
  timeHorizon: string;
}

export interface InvestmentStrategy {
  summary: string;
  totalAmount: number;
  timeHorizon: string;
  targetReturn: number;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  sectors: SectorStrategy[];
  diversification: string;
  keyConsiderations: string[];
  warnings: string[];
  monthlyContribution?: number;
  projectedValue: number;
}

/**
 * Call Google Gemini API for investment strategy generation
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response from AI';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * Fetch real-time market data for sector ETFs
 */
async function fetchSectorMarketData(sectorETF: string): Promise<any> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sectorETF}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) return null;

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;

    return {
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      volume: parseInt(quote['06. volume'] || '0'),
      high: parseFloat(quote['03. high'] || '0'),
      low: parseFloat(quote['04. low'] || '0'),
    };
  } catch (error) {
    console.error(`Error fetching ${sectorETF}:`, error);
    return null;
  }
}

/**
 * Fetch real-time market data for key sectors
 */
async function fetchMarketConditions(): Promise<string> {
  const sectorETFs = {
    'Technology': 'XLK',
    'Healthcare': 'XLV',
    'Financial Services': 'XLF',
    'Consumer Goods': 'XLP',
    'Real Estate': 'VNQ',
    'Energy': 'XLE',
  };

  const marketData: any[] = [];
  
  // Fetch data for all sectors in parallel
  const promises = Object.entries(sectorETFs).map(async ([sector, etf]) => {
    const data = await fetchSectorMarketData(etf);
    if (data) {
      marketData.push({ sector, etf, ...data });
    }
  });

  await Promise.all(promises);

  if (marketData.length === 0) {
    return 'Real-time market data temporarily unavailable. Recommendations based on general market conditions.';
  }

  // Format market data for AI prompt
  const marketSummary = marketData.map(m => 
    `${m.sector} (${m.etf}): $${m.price.toFixed(2)} (${m.changePercent >= 0 ? '+' : ''}${m.changePercent.toFixed(2)}%), Position: ${((m.price - m.low) / (m.high - m.low) * 100).toFixed(1)}% of 52-week range`
  ).join('\n');

  return `CURRENT MARKET CONDITIONS (Real-time data as of today):
${marketSummary}

Market Analysis:
- Best performing sectors: ${marketData.filter(m => m.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 3).map(m => m.sector).join(', ') || 'None'}
- Underperforming sectors: ${marketData.filter(m => m.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 3).map(m => m.sector).join(', ') || 'None'}
- Overall market trend: ${marketData.filter(m => m.changePercent > 0).length > marketData.length / 2 ? 'Bullish' : marketData.filter(m => m.changePercent < 0).length > marketData.length / 2 ? 'Bearish' : 'Mixed'}`;
}

/**
 * Generate comprehensive investment strategy using AI with real-time data
 */
export async function generateInvestmentStrategy(
  request: InvestmentStrategyRequest
): Promise<InvestmentStrategy> {
  const timeYears = request.timeMonths / 12;
  const riskTolerance = request.riskTolerance || 'medium';
  
  // Fetch real-time market conditions
  const marketConditions = await fetchMarketConditions();
  
  const prompt = `You are a professional financial advisor. Create a comprehensive investment strategy for a client with the following requirements:

${marketConditions}

CLIENT REQUIREMENTS:
Investment Amount: $${request.amount.toLocaleString()} USD
Time Horizon: ${request.timeMonths} months (${timeYears.toFixed(1)} years)
Desired Annual Interest Rate: ${request.desiredInterest}%
Risk Tolerance: ${riskTolerance}

IMPORTANT: Base your recommendations on the CURRENT MARKET CONDITIONS shown above. Adjust sector allocations based on:
1. Which sectors are currently performing well (consider increasing allocation)
2. Which sectors are underperforming (may present opportunities or should be reduced)
3. Current market trends (bullish/bearish/mixed)
4. Risk tolerance of the client
5. Time horizon for investment

Provide a detailed investment strategy in JSON format:

Investment Amount: $${request.amount.toLocaleString()} USD
Time Horizon: ${request.timeMonths} months (${timeYears.toFixed(1)} years)
Desired Annual Interest Rate: ${request.desiredInterest}%
Risk Tolerance: ${riskTolerance}

Provide a detailed investment strategy in JSON format:
{
  "summary": "A comprehensive 3-4 sentence summary of the investment strategy",
  "totalAmount": ${request.amount},
  "timeHorizon": "${request.timeMonths} months (${timeYears.toFixed(1)} years)",
  "targetReturn": ${request.desiredInterest},
  "expectedReturn": ${request.desiredInterest * 0.8},
  "riskLevel": "${riskTolerance}",
  "sectors": [
    {
      "sector": "Technology",
      "allocation": 25,
      "expectedReturn": ${request.desiredInterest * 0.9},
      "riskLevel": "high",
      "reasoning": "Detailed explanation of why this sector allocation makes sense",
      "specificRecommendations": ["Specific stock/ETF recommendation 1", "Recommendation 2", "Recommendation 3"],
      "timeHorizon": "Short-term (1-2 years) or Medium-term (3-5 years) or Long-term (5+ years)"
    },
    {
      "sector": "Healthcare",
      "allocation": 20,
      "expectedReturn": ${request.desiredInterest * 0.85},
      "riskLevel": "medium",
      "reasoning": "Detailed explanation",
      "specificRecommendations": ["Recommendation 1", "Recommendation 2"],
      "timeHorizon": "Medium-term"
    },
    {
      "sector": "Financial Services",
      "allocation": 15,
      "expectedReturn": ${request.desiredInterest * 0.75},
      "riskLevel": "medium",
      "reasoning": "Detailed explanation",
      "specificRecommendations": ["Recommendation 1", "Recommendation 2"],
      "timeHorizon": "Medium-term"
    },
    {
      "sector": "Consumer Goods",
      "allocation": 15,
      "expectedReturn": ${request.desiredInterest * 0.7},
      "riskLevel": "low",
      "reasoning": "Detailed explanation",
      "specificRecommendations": ["Recommendation 1", "Recommendation 2"],
      "timeHorizon": "Long-term"
    },
    {
      "sector": "Real Estate",
      "allocation": 10,
      "expectedReturn": ${request.desiredInterest * 0.8},
      "riskLevel": "medium",
      "reasoning": "Detailed explanation",
      "specificRecommendations": ["REIT recommendation 1", "Recommendation 2"],
      "timeHorizon": "Long-term"
    },
    {
      "sector": "Energy",
      "allocation": 10,
      "expectedReturn": ${request.desiredInterest * 0.85},
      "riskLevel": "high",
      "reasoning": "Detailed explanation",
      "specificRecommendations": ["Recommendation 1", "Recommendation 2"],
      "timeHorizon": "Medium-term"
    },
    {
      "sector": "Bonds/Fixed Income",
      "allocation": 5,
      "expectedReturn": ${request.desiredInterest * 0.4},
      "riskLevel": "low",
      "reasoning": "Detailed explanation for stability and diversification",
      "specificRecommendations": ["Government bonds", "Corporate bonds", "Bond ETFs"],
      "timeHorizon": "Short-term to Medium-term"
    }
  ],
  "diversification": "Detailed explanation of how the portfolio is diversified across sectors, asset classes, and risk levels",
  "keyConsiderations": ["Consideration 1", "Consideration 2", "Consideration 3", "Consideration 4"],
  "warnings": ["Risk warning 1", "Risk warning 2", "Important disclaimer"],
  "monthlyContribution": ${request.amount / request.timeMonths},
  "projectedValue": ${request.amount * Math.pow(1 + request.desiredInterest / 100, timeYears)}
}

Important guidelines:
- Total allocation across all sectors should equal 100%
- Adjust sector allocations based on CURRENT MARKET CONDITIONS and risk tolerance (${riskTolerance})
- If a sector is performing well currently, you may recommend higher allocation
- If a sector is underperforming, consider if it's a buying opportunity or should be avoided
- Expected returns should be realistic based on CURRENT market performance, not just historical averages
- Include specific stock/ETF ticker symbols when possible (e.g., AAPL, SPY, VTI, XLK, XLV)
- Consider the time horizon when recommending sectors
- Provide actionable, specific recommendations based on TODAY'S market conditions
- Reference the real-time market data in your reasoning
- Include appropriate warnings about market risks and current volatility

Return ONLY valid JSON, no additional text.`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Try to extract JSON from response
    let jsonText = response.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const strategy = JSON.parse(jsonText);
    
    // Calculate projected value
    const projectedValue = request.amount * Math.pow(1 + (strategy.expectedReturn || request.desiredInterest * 0.8) / 100, timeYears);
    
    return {
      summary: strategy.summary || `Investment strategy for $${request.amount.toLocaleString()} over ${request.timeMonths} months targeting ${request.desiredInterest}% annual return.`,
      totalAmount: strategy.totalAmount || request.amount,
      timeHorizon: strategy.timeHorizon || `${request.timeMonths} months`,
      targetReturn: strategy.targetReturn || request.desiredInterest,
      expectedReturn: strategy.expectedReturn || request.desiredInterest * 0.8,
      riskLevel: strategy.riskLevel || riskTolerance,
      sectors: strategy.sectors || [],
      diversification: strategy.diversification || 'Portfolio is diversified across multiple sectors to manage risk.',
      keyConsiderations: strategy.keyConsiderations || ['Market volatility', 'Economic conditions', 'Sector performance'],
      warnings: strategy.warnings || ['Past performance does not guarantee future results', 'Investments are subject to market risk'],
      monthlyContribution: strategy.monthlyContribution || request.amount / request.timeMonths,
      projectedValue: strategy.projectedValue || projectedValue,
    };
  } catch (error) {
    console.error('Error generating investment strategy:', error);
    
    // Fallback strategy
    return generateFallbackStrategy(request);
  }
}

/**
 * Generate fallback strategy when AI is unavailable
 */
function generateFallbackStrategy(request: InvestmentStrategyRequest): InvestmentStrategy {
  const timeYears = request.timeMonths / 12;
  const riskTolerance = request.riskTolerance || 'medium';
  const expectedReturn = request.desiredInterest * 0.8;
  const projectedValue = request.amount * Math.pow(1 + expectedReturn / 100, timeYears);

  const baseSectors: SectorStrategy[] = [
    {
      sector: 'Technology',
      allocation: riskTolerance === 'high' ? 30 : riskTolerance === 'medium' ? 25 : 15,
      expectedReturn: expectedReturn * 1.1,
      riskLevel: 'high',
      reasoning: 'Technology sector offers high growth potential but with higher volatility. Suitable for investors with longer time horizons.',
      specificRecommendations: ['Technology ETFs (XLK, VGT)', 'Large-cap tech stocks (AAPL, MSFT, GOOGL)', 'Tech growth funds'],
      timeHorizon: 'Medium to Long-term (3-5 years)',
    },
    {
      sector: 'Healthcare',
      allocation: 20,
      expectedReturn: expectedReturn * 0.95,
      riskLevel: 'medium',
      reasoning: 'Healthcare provides stability and growth, driven by demographic trends and innovation.',
      specificRecommendations: ['Healthcare ETFs (XLV, VHT)', 'Pharmaceutical companies', 'Biotech funds'],
      timeHorizon: 'Long-term (5+ years)',
    },
    {
      sector: 'Financial Services',
      allocation: 15,
      expectedReturn: expectedReturn * 0.85,
      riskLevel: 'medium',
      reasoning: 'Financial sector benefits from interest rate environments and economic growth.',
      specificRecommendations: ['Bank ETFs (XLF, VFH)', 'Insurance companies', 'Financial services funds'],
      timeHorizon: 'Medium-term (3-5 years)',
    },
    {
      sector: 'Consumer Goods',
      allocation: 15,
      expectedReturn: expectedReturn * 0.75,
      riskLevel: 'low',
      reasoning: 'Consumer goods provide defensive positioning and steady dividends.',
      specificRecommendations: ['Consumer ETFs (XLP, VDC)', 'Dividend stocks', 'Consumer staples'],
      timeHorizon: 'Long-term (5+ years)',
    },
    {
      sector: 'Real Estate',
      allocation: 10,
      expectedReturn: expectedReturn * 0.9,
      riskLevel: 'medium',
      reasoning: 'Real estate offers diversification and income through REITs.',
      specificRecommendations: ['REIT ETFs (VNQ, SCHH)', 'Real estate investment trusts', 'Property funds'],
      timeHorizon: 'Long-term (5+ years)',
    },
    {
      sector: 'Energy',
      allocation: 10,
      expectedReturn: expectedReturn * 0.95,
      riskLevel: 'high',
      reasoning: 'Energy sector provides cyclical opportunities but with higher volatility.',
      specificRecommendations: ['Energy ETFs (XLE, VDE)', 'Oil and gas companies', 'Renewable energy funds'],
      timeHorizon: 'Medium-term (3-5 years)',
    },
    {
      sector: 'Bonds/Fixed Income',
      allocation: riskTolerance === 'low' ? 20 : riskTolerance === 'medium' ? 5 : 0,
      expectedReturn: expectedReturn * 0.4,
      riskLevel: 'low',
      reasoning: 'Bonds provide stability and reduce portfolio volatility.',
      specificRecommendations: ['Government bonds', 'Corporate bonds', 'Bond ETFs (AGG, BND)'],
      timeHorizon: 'Short to Medium-term (1-5 years)',
    },
  ];

  return {
    summary: `Diversified investment strategy for $${request.amount.toLocaleString()} over ${request.timeMonths} months (${timeYears.toFixed(1)} years) targeting ${request.desiredInterest}% annual return. Portfolio is balanced across ${baseSectors.length} sectors with ${riskTolerance} risk tolerance.`,
    totalAmount: request.amount,
    timeHorizon: `${request.timeMonths} months (${timeYears.toFixed(1)} years)`,
    targetReturn: request.desiredInterest,
    expectedReturn,
    riskLevel: riskTolerance,
    sectors: baseSectors,
    diversification: `Portfolio is diversified across ${baseSectors.length} sectors including technology, healthcare, financial services, consumer goods, real estate, energy, and fixed income. This diversification helps manage risk while pursuing growth opportunities.`,
    keyConsiderations: [
      'Regular portfolio rebalancing is recommended',
      'Monitor market conditions and adjust allocations as needed',
      'Consider dollar-cost averaging for market entry',
      'Review and adjust strategy based on changing financial goals',
    ],
    warnings: [
      'Past performance does not guarantee future results',
      'All investments are subject to market risk and potential loss',
      'Diversification does not ensure profit or protect against loss',
      'Consider consulting with a financial advisor for personalized advice',
    ],
    monthlyContribution: request.amount / request.timeMonths,
    projectedValue,
  };
}

