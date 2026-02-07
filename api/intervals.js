export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.INTERVALS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key missing' });
    return;
  }

  const auth = Buffer.from(`API_KEY:${apiKey}`).toString('base64');

  // Fix: Strip /api from path, add /api/v1
  let path = req.url.replace(/^\/api/, '/api/v1');
  
  const targetUrl = `https://intervals.icu${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Intervals API failed' });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
