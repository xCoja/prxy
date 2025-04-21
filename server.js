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

    // Map through the leaderboard data and modify the fields to match the expected format
    leaderboard = leaderboard.map(user => ({
      userId: user.id, // Change 'id' to 'userId'
      name: user.name,
      wagered: user.wagerTotal, // Change 'wagerTotal' to 'wagered'
      avatar: user.img, // Change 'img' to 'avatar'
      level: user.level,
      prize: user.prizeAmount, // Change 'prizeAmount' to 'prize'
    }));

    // Send the modified data as the response
    res.json(leaderboard); // Send just the array of formatted users
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
