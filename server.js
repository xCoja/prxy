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

    // Map through the leaderboard data and modify just 'wagerTotal' and 'img' fields
    leaderboard = leaderboard.map(user => {
      return {
        id: user.id, // Keep 'id' as is
        name: user.name, // Keep 'name' as is
        wagerTotal: user.wagerTotal, // Keep 'wagerTotal' as is
        img: user.img, // Keep 'img' as is
        level: user.level, // Keep 'level' as is
        lastActive: user.lastActive, // Keep 'lastActive' as is
        joined: user.joined, // Keep 'joined' as is
        totalDeposits: user.totalDeposits, // Keep 'totalDeposits' as is
        totalRewards: user.totalRewards, // Keep 'totalRewards' as is
        prizeAmount: user.prizeAmount // Keep 'prizeAmount' as is
      };
    });

    // Modify just the fields for 'wagerTotal' to 'wagered' and 'img' to 'avatar'
    leaderboard = leaderboard.map(user => {
      return {
        ...user, // Spread existing user data
        wagered: user.wagerTotal, // Change 'wagerTotal' to 'wagered'
        avatar: user.img, // Change 'img' to 'avatar'
        // Remove 'wagerTotal' and 'img' from the object
        // 'wagerTotal': undefined,
        // 'img': undefined
      };
    });

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
