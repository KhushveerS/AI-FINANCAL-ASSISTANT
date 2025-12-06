# API Setup Guide

This application uses real AI-powered analysis with Google Gemini and various data APIs. To enable full functionality, you need to configure API keys.

## Required API Keys

### 1. Google Gemini API Key (Required for AI Analysis)

The Gemini API is used for:
- Comprehensive stock analysis
- Geopolitical risk assessment
- Social media sentiment analysis
- Investment recommendations

**How to get your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Add to your `.env` file:**
```
VITE_GEMINI_API_KEY=your_api_key_here
```

### 2. Alpha Vantage API Key (Optional - has default)

Used for:
- Real-time stock quotes
- Company overview data
- News sentiment (if available)

**How to get your API key:**
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Fill out the form to get a free API key
3. Copy your API key

**Add to your `.env` file:**
```
VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

**Note:** The app includes a default API key, but it has rate limits. Getting your own key is recommended.

### 3. NewsAPI Key (Optional)

Used for:
- Additional news sources
- More comprehensive news analysis

**How to get your API key:**
1. Visit [NewsAPI](https://newsapi.org/register)
2. Sign up for a free account
3. Copy your API key

**Add to your `.env` file:**
```
VITE_NEWS_API_KEY=your_api_key_here
```

## Setup Instructions

1. Create a `.env` file in the root directory of the project
2. Add your API keys following the format above
3. Restart your development server
4. The application will now use real AI analysis!

## Example .env file

```
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_ALPHA_VANTAGE_API_KEY=XXXXXXXXXXXXXXXX
VITE_NEWS_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
```

## Features Enabled by API Keys

### With Gemini API Key:
- ✅ AI-powered comprehensive stock analysis
- ✅ Detailed technical and fundamental analysis
- ✅ Geopolitical risk assessment
- ✅ Social media sentiment analysis
- ✅ Intelligent investment recommendations
- ✅ Risk factor identification
- ✅ Market outlook predictions

### Without Gemini API Key:
- ⚠️ Basic stock data (price, volume)
- ⚠️ Limited analysis (fallback mode)
- ❌ No AI insights
- ❌ No geopolitical analysis
- ❌ No AI recommendations

## Troubleshooting

### "Gemini API key not configured" error
- Make sure your `.env` file is in the root directory
- Ensure the variable name is exactly `VITE_GEMINI_API_KEY`
- Restart your development server after adding the key
- Check that there are no extra spaces or quotes around the key

### API Rate Limits
- Alpha Vantage free tier: 5 API calls per minute, 500 per day
- NewsAPI free tier: 100 requests per day
- Gemini: Check your quota in Google Cloud Console

### CORS Issues
- Some APIs may have CORS restrictions
- The app includes fallback mechanisms for when APIs are unavailable

## Security Notes

- **Never commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- API keys are exposed in the frontend (Vite environment variables)
- For production, consider using a backend proxy for API keys

