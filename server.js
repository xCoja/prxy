// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/leaderboard", async (req, res) => {
    try {
        const response = await fetch(
            "https://csgobig.com/api/partners/getRefDetails/jonjiHBDKEBkcndi63863bfkdbKBDOSB?from=1742083200000&to=1745260800000"
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
