export default async function handler(req, res) {
  const { query, type } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    let url;
    if (type === 'search') {
      url = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=20`;
    } else if (type === 'song') {
      url = `https://saavn.dev/api/songs/${query}`;
    } else {
      url = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query || 'latest hits')}&limit=20`;
    }

    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
