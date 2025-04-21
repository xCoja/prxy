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

    // Remove the user who abuses wagering
    leaderboard = leaderboard.filter(user => user.id !== "76561199033503260");

    // Sort the leaderboard by 'wagered' in descending order
    leaderboard.sort((a, b) => b.wagered - a.wagered);

    // Assign prize amounts to the top 10 users
    const prizeAmounts = [1000, 750, 500, 300, 150, 75, 75, 50, 50, 50];
    leaderboard = leaderboard.slice(0, 10).map((user, index) => ({
      userId: user.id, // Change 'id' to 'userId'
      name: user.name,
      wagered: user.wagered, // Keep 'wagered' as is
      avatar: user.avatar, // Keep 'avatar' as is
      level: user.level,
      prize: prizeAmounts[index] || 0, // Assign prize based on position
      class: "prize", // Add a class to identify top 10 users
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
