# Google Custom Search Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get API Key
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing)
3. Click **"+ CREATE CREDENTIALS"** → **"API key"**
4. Copy the API key
5. Enable **"Custom Search API"** at https://console.cloud.google.com/apis/library

### Step 2: Create Search Engine
1. Go to https://programmablesearchengine.google.com/
2. Click **"Add"** to create a new search engine
3. **Sites to search:** Enter `*.selfstudys.com`, `*.shaalaa.com`, `*.vedantu.com`, `*.vturesource.com`
4. Click **"Create"**
5. Copy your **Search Engine ID** (starts with a long string of letters/numbers)

### Step 3: Add to AQMD
Add these to your `.env.local` file:

```
GOOGLE_SEARCH_API_KEY=your_api_key_from_step_1
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_from_step_2
```

### Step 4: Restart Server
```bash
npm run dev
```

## Free Tier Limits
- **100 searches per day** (sufficient for most users)
- If you need more, consider upgrading or implementing caching

## Troubleshooting
- **"API key not valid"**: Make sure Custom Search API is enabled
- **No results**: Check that your Search Engine ID is correct
- **Quota exceeded**: You've hit the 100/day limit; wait until tomorrow or upgrade

---

**Without API keys:** The system will fall back to AI-generated portal links (less accurate but still functional).
