export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=30`);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from Deezer', details: err.message });
  }
}
