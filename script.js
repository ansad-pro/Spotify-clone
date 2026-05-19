const songsGrid = document.getElementById('songsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const audioPlayer = document.getElementById('audioPlayer');
const nowImg = document.getElementById('nowImg');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const sectionTitle = document.getElementById('sectionTitle');

async function fetchSongs(query = 'malayalam hits') {
  songsGrid.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const res = await fetch(`/api/saavn?type=search&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const songs = data?.data?.results || [];
    
    if (songs.length === 0) {
      songsGrid.innerHTML = '<p class="loading">No songs found.</p>';
      return;
    }
    
    renderSongs(songs);
  } catch (err) {
    songsGrid.innerHTML = '<p class="loading">Failed to load. Try again.</p>';
    console.error(err);
  }
}

function renderSongs(songs) {
  songsGrid.innerHTML = '';
  songs.forEach((song, idx) => {
    const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
    const artists = song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown';
    const downloadUrl = song.downloadUrl?.[4]?.url || song.downloadUrl?.[3]?.url || song.downloadUrl?.[0]?.url;
    
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
      <img src="${img}" alt="${song.name}" />
      <h3>${song.name}</h3>
      <p>${artists}</p>
    `;
    card.addEventListener('click', () => playSong(song, downloadUrl, img, artists));
    songsGrid.appendChild(card);
    
    // Auto-play first song
    if (idx === 0 && downloadUrl) {
      playSong(song, downloadUrl, img, artists);
    }
  });
}

function playSong(song, url, img, artists) {
  if (!url) {
    alert('Song URL not available');
    return;
  }
  audioPlayer.src = url;
  audioPlayer.play().catch(e => console.log('Autoplay blocked, click play'));
  nowImg.src = img;
  nowTitle.textContent = song.name;
  nowArtist.textContent = artists;
}

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) {
    sectionTitle.textContent = `Results for "${q}"`;
    fetchSongs(q);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

// Initial load
fetchSongs('malayalam hits');
