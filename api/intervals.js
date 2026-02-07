// Vercel/Netlify serverless function
export default async function handler(req, res) {
  const apiKey = process.env.INTERVALS_API_KEY;
  const auth = Buffer.from(`API_KEY:${apiKey}`).toString('base64');

  const targetUrl = `https://intervals.icu${req.url.replace('/api', '/api/v1')}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });

  const data = await response.json();
  res.status(200).json(data);
}
