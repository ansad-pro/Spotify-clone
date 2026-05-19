// Using Deezer's public CORS-enabled API proxy
const API = 'https://api.deezer.com';
const PROXY = 'https://corsproxy.io/?';

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seek = document.getElementById('seek');
const vol = document.getElementById('vol');
const searchInput = document.getElementById('search-input');
const results = document.getElementById('results');
const npArt = document.getElementById('np-art');
const npTitle = document.getElementById('np-title');
const npArtist = document.getElementById('np-artist');
const curTime = document.getElementById('cur-time');
const durTime = document.getElementById('dur-time');

let queue = [];
let currentIdx = 0;

async function searchTracks(query) {
  results.innerHTML = '<p style="color:#b3b3b3;">Loading...</p>';
  try {
    const res = await fetch(PROXY + encodeURIComponent(`${API}/search?q=${query}&limit=30`));
    const data = await res.json();
    queue = data.data.filter(t => t.preview);
    renderResults();
  } catch (e) {
    results.innerHTML = '<p style="color:#ff6b6b;">Failed to load. Try again.</p>';
  }
}

function renderResults() {
  results.innerHTML = '';
  queue.forEach((track, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${track.album.cover_medium}" alt="" />
      <div class="card-title">${track.title}</div>
      <div class="card-artist">${track.artist.name}</div>
    `;
    card.addEventListener('click', () => playTrack(i));
    results.appendChild(card);
  });
}

function playTrack(idx) {
  currentIdx = idx;
  const t = queue[idx];
  if (!t) return;
  audio.src = t.preview;
  audio.play();
  playBtn.textContent = '⏸';
  npArt.src = t.album.cover_small;
  npTitle.textContent = t.title;
  npArtist.textContent = t.artist.name;
}

playBtn.addEventListener('click', () => {
  if (!audio.src) return;
  if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
  else { audio.pause(); playBtn.textContent = '▶'; }
});

nextBtn.addEventListener('click', () => {
  if (currentIdx < queue.length - 1) playTrack(currentIdx + 1);
});
prevBtn.addEventListener('click', () => {
  if (currentIdx > 0) playTrack(currentIdx - 1);
});

audio.addEventListener('ended', () => {
  if (currentIdx < queue.length - 1) playTrack(currentIdx + 1);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    seek.value = (audio.currentTime / audio.duration) * 100;
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60).toString().padStart(2,'0');
    curTime.textContent = `${m}:${s}`;
  }
});

seek.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
});

vol.addEventListener('input', () => { audio.volume = vol.value / 100; });
audio.volume = 0.8;

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    searchTracks(searchInput.value.trim());
  }
});

document.querySelectorAll('#playlist-list li').forEach(li => {
  li.addEventListener('click', () => searchTracks(li.dataset.q));
});

// Load default
searchTracks('malayalam hits');
