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
    // Fetch data from the external CSGO Big API (time range should be updated dynamically if necessary)
    const response = await axios.get('https://csgobig.com/api/partners/getRefDetails/jonjiHBDKEBkcndi63863bfkdbKBDOSB?from=1745280000000&to=1747958400000');
    let leaderboard = response.data.results || []; // Ensure data exists

    // Remove the specified user based on 'id' (bes)
    leaderboard = leaderboard.filter(user => user.id !== "7f996c39-e616-4d3c-9565-62f7cac64182");

    // Map through the leaderboard data and modify 'wagerTotal' to 'wagered', and 'img' to 'avatar'
    leaderboard = leaderboard.map(user => {
      return {
        id: user.id, 
        name: user.name, 
        wagered: user.wagerTotal, // Change 'wagerTotal' to 'wagered'
        avatar: user.img, // Change 'img' to 'avatar'
        level: user.level, 
        lastActive: user.lastActive, 
        joined: user.joined, 
        prizeAmount: user.prizeAmount // prizeAmount is included for future use
      };
    });

    // Sort leaderboard by 'wagered' (descending order)
    leaderboard.sort((a, b) => b.wagered - a.wagered);

    // Assign prize amounts for top 10 users
    const prizeAmounts = [
      1000, 750, 500, 300, 150, 75, 75, 50, 50, 50
    ];

    // Assign prize amount to each user in top 10
    leaderboard.slice(0, 10).forEach((user, index) => {
      user.prize = prizeAmounts[index] || 0; // Ensure prize is assigned
    });

    // Send the modified data as the response (top 10 only)
    res.json(leaderboard.slice(0, 10)); // Send only the top 10 users
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
