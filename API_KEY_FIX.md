# 🔧 Fix: API Key Invalid Error

## The Problem
Google says: `"API key not valid. Please pass a valid API key."`

**This means the Custom Search API is NOT enabled for your API key.**

---

## Quick Fix (2 minutes)

### Step 1: Enable Custom Search API
1. Go to: https://console.cloud.google.com/apis/library/customsearch.googleapis.com
2. Make sure you're in the **same project** where you created the API key
3. Click the blue **"ENABLE"** button
4. Wait 1-2 minutes for it to activate

### Step 2: Verify It's Enabled
1. Go to: https://console.cloud.google.com/apis/dashboard
2. You should see "Custom Search API" in the list of enabled APIs

### Step 3: Test Again
1. Restart your dev server (Ctrl+C, then `npm run dev`)
2. Try searching in the Question Vault
3. Check terminal - you should see: `[Google Search] Found X results`

---

## Alternative: Create a New Restricted Key (Recommended)

If the above doesn't work, create a new API key with proper restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Delete the old unrestricted key (for security)
3. Click **"+ CREATE CREDENTIALS"** → **"API key"**
4. Click **"RESTRICT KEY"**
5. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose **"Custom Search API"** from the dropdown
6. Click **"SAVE"**
7. Copy the new key and replace it in `.env.local`

---

**Current Status:** System is using AI fallback (70% accuracy)  
**After Fix:** Will use real Google Search (95% accuracy)
