import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (you can adjust this in production)
app.use(cors());

// Root route to check if the service is working
app.get("/", (req, res) => {
  res.send("CSGOBig Proxy Service is running!");
});

// Proxy endpoint to fetch and modify the leaderboard data
app.get("/csgobig-proxy", async (req, res) => {
  try {
    const response = await axios.get('https://csgobig.com/api/partners/getRefDetails/jonjiHBDKEBkcndi63863bfkdbKBDOSB?from=1742083200000&to=1745260800000');
    let leaderboard = response.data.results || []; // Ensure data exists

    // Map through the leaderboard data and rename properties
    leaderboard = leaderboard.map(user => {
      return {
        ...user,
        wagered: user.wagerTotal, // Rename 'wagerTotal' to 'wagered'
        prizeAmount: user.prize || 0, // Rename 'prize' to 'prizeAmount'
        // You can add more renaming here as needed
      };
    });

    // Send the modified data as the response
    res.json({ results: leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
