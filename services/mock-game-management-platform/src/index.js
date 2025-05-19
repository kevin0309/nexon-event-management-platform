const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.MOCK_SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Event condition validation endpoints
app.post('/validate-event-condition/success', (req, res) => {
  console.log('Received validate-event-condition/success request');
  res.json({ isValid: true });
});

app.post('/validate-event-condition/failed', (req, res) => {
  console.log('Received validate-event-condition/failed request');
  res.json({ isValid: false });
});

// Event reward provision endpoints
app.post('/provide-event-reward/success', (req, res) => {
  console.log('Received provide-event-reward/success request');
  res.json({ success: true });
});

app.post('/provide-event-reward/failed', (req, res) => {
  console.log('Received provide-event-reward/failed request');
  res.json({ success: false });
});

// Start server
app.listen(port, () => {
  console.log(`Mock API server is running on port ${port}`);
}); 