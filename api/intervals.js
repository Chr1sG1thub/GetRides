export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.INTERVALS_API_KEY || '3bjz27ydq97vjwmrc7f8u12oo'; // fallback for test
  const authString = `API_KEY:${apiKey}`;
  const auth = Buffer.from(authString).toString('base64');
  
  console.log('Auth string:', authString); // Logs in Vercel dashboard
  console.log('Target URL:', `https://intervals.icu${req.url.replace(/^\/api/, '/api/v1')}`);

  const targetUrl = `https://intervals.icu${req.url.replace(/^\/api/, '/api/v1')}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    console.log('Intervals status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Intervals ${response.status}`, details: errText });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

