// Importing necessary libraries
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (you can adjust this in production)
app.use(cors());

// Proxy endpoint to fetch the leaderboard data
app.get("/csgobig-proxy", async (req, res) => {
  try {
    const response = await axios.get('https://csgobig.com/api/partners/getRefDetails/jonjiHBDKEBkcndi63863bfkdbKBDOSB?from=1742083200000&to=1745260800000');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
