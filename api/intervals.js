export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const apiKey = process.env.INTERVALS_API_KEY;
  const auth = Buffer.from(`API_KEY:${apiKey}`).toString('base64');
  
  const url = new URL(req.url, 'https://intervals.icu');
  url.pathname = '/api/v1' + url.pathname;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
