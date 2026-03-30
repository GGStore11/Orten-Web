const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
const PORT = 3000;

const WEBHOOK_URL = 'ضع هنا Webhook آمن في السيرفر';

app.post('/log', async (req, res) => {
  const { title, msg } = req.body;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [{ title, description: msg, color: 6063574, timestamp: new Date() }] })
    });
    res.sendStatus(200);
  } catch(e) { res.sendStatus(500); }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));