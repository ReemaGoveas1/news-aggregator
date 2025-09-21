const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 8000;

const GUARDIAN_API_KEY = '4eb38e7d-aa50-4079-abbb-800cbe7cab23';

app.use(cors());

app.get('/guardian', async (req, res) => {
  const { keyword, category } = req.query;
  let url = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=trailText,thumbnail&page-size=20&order-by=newest`;

  if (keyword) url += `&q=${encodeURIComponent(keyword)}`;
  if (category && category !== 'all') url += `&section=${encodeURIComponent(category)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Guardian API error' });
  }
});

app.listen(PORT, () => console.log(`Proxy server running at http://localhost:${PORT}`));
