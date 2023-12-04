import express from 'express';
import { botData } from './dataStore';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Received request for /');
  res.send(`
    <h1>Arbitrage Bot Status</h1>
    <div id="status">
      <p>Last Action: <span id="lastAction">${botData.lastAction}</span></p>
      <p>Last Price: <span id="lastPrice">${botData.lastPrice}</span></p>
      <p>Last Error: <span id="lastError">${botData.lastError}</span></p>
    </div>
    <script>
      const evtSource = new EventSource("/status");
      evtSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        document.getElementById('lastAction').textContent = data.lastAction;
        document.getElementById('lastPrice').textContent = data.lastPrice;
        document.getElementById('lastError').textContent = data.lastError;
      }
    </script>
  `);
});

app.get('/status', (req, res) => {
  console.log('Opened connection for /status');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send an update every 10 seconds
  const intervalId = setInterval(() => {
    console.log('Sending update to client');
    res.write(`data: ${JSON.stringify(botData)}\n\n`);
  }, 10000);

  // Clear interval on client disconnect
  req.on('close', () => {
    console.log('Client disconnected from /status');
    clearInterval(intervalId);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
