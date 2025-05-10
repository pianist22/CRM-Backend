const axios = require('axios');

exports.sendMessage = async (req, res) => {
  const { logId, message } = req.body;

  const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

  // Simulate real-world delay
  setTimeout(async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/receipt', {
        logId,
        status,
      });
    } catch (err) {
      console.error('Error sending delivery receipt:', err);
    }
  }, 1000 + Math.random() * 2000); // 1-3s delay

  res.json({ status: 'processing' });
};
