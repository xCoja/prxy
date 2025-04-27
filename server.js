import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';  // Add CORS for Render deployment

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = '05381fe04025772964ce1fedc91b55d7'; // Your API key

// Define __dirname manually since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the minTime and maxTime statically for lifetime data
const MIN_TIME = new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).getTime();  // January 1, 2023, 00:00 UTC
const MAX_TIME = new Date(Date.UTC(2026, 11, 31, 23, 59, 59)).getTime();  // December 31, 2026, 23:59 UTC

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Use CORS for cross-origin requests (necessary for front-end access on Render)
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch and serve leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    try {
        const cacheFile = 'leaderboard-cache.json';

        // Check if the cache file exists and if it's still valid
        if (fs.existsSync(cacheFile)) {
            const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            const currentTime = Date.now();

            // If the cache is valid (within the CACHE_DURATION), return cached data
            if (currentTime - cachedData.timestamp < CACHE_DURATION) {
                return res.json(cachedData.data);
            }
        }

        // Fetch fresh data from Chicken.GG API with the static minTime and maxTime
        const url = `https://affiliates.chicken.gg/v1/referrals?key=${API_KEY}&minTime=${MIN_TIME}&maxTime=${MAX_TIME}`;
        
        const response = await fetch(url);
        const data = await response.json();

        // Write the fresh data to the cache file
        fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), data }));

        // Send the fresh data to the client
        res.json(data);
    } catch (error) {
        console.error('Error fetching API:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
