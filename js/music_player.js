document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const loopBtn = document.getElementById('loop-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const progressBar = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const currentSongEl = document.getElementById('current-song');
  const playButtons = document.querySelectorAll('.play-button');
  const skipBackwardBtn = document.getElementById('skip-backward-btn');
  const skipForwardBtn = document.getElementById('skip-forward-btn');
  const volumeSlider = document.getElementById('volume-slider');
  
  let originalPlaylist = Array.from(playButtons).map(button => button.getAttribute('data-src'));  // Original array
  let playlist = [...originalPlaylist];  // Working copy for shuffling
  let currentIndex = 0;
  let isShuffled = false;

  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentIndex = Array.from(playButtons).indexOf(button);
      if (isShuffled) {
        playlist = shuffleArray([...originalPlaylist]);  // Shuffle if mode is on
      }
      playSong();
    });
  });

  volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;  // Update volume based on slider
  });

  nextBtn.addEventListener('click', () => {
    if (isShuffled) {
      currentIndex = (currentIndex + 1) % playlist.length;  // Use shuffled array
    } else {
      currentIndex = (currentIndex + 1) % originalPlaylist.length;  // Use original
    }
    playSong();
  });

  prevBtn.addEventListener('click', () => {
    if (isShuffled) {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    } else {
      currentIndex = (currentIndex - 1 + originalPlaylist.length) % originalPlaylist.length;
    }
    playSong();
  });
  playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      audioPlayer.pause();
      playPauseBtn.textContent = 'Play ';
    }
  });

  loopBtn.addEventListener('click', () => {
    audioPlayer.loop = !audioPlayer.loop;
    loopBtn.textContent = audioPlayer.loop ? '[Loop: ON]' : '[Loop:OFF]';
    loopBtn.classList.toggle('active', audioPlayer.loop);
  });

  shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;  // Toggle shuffle state
    if (isShuffled) {
      playlist = shuffleArray([...originalPlaylist]);  // Shuffle the array
      currentIndex = 0;  // Reset index for shuffled play
      playSong();  // Play the first shuffled song
      shuffleBtn.textContent = '[Shuffle: ON]';
      shuffleBtn.classList.add('active');
    } else {
      playlist = [...originalPlaylist];  // Reset to original
      shuffleBtn.textContent = '[Shuffle:OFF]';
      shuffleBtn.classList.remove('active');
    }
  });

  audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('ended', () => {
    if (!audioPlayer.loop) {
      if (isShuffled) {
        nextBtn.click();  // Go to next in shuffled playlist
      } else {
        nextBtn.click();  // Go to next in original playlist
      }
    }
  });

  progressBar.addEventListener('click', (e) => {
    if (audioPlayer.duration) {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const clickPercentage = x / width;
        audioPlayer.currentTime = clickPercentage * audioPlayer.duration;
    }
});
  
  skipBackwardBtn.addEventListener('click', () => {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);  // Skip back 10 seconds
  });
  
  skipForwardBtn.addEventListener('click', () => {
      audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);  // Skip forward 10 seconds
  })

  function playSong() {
    if (isShuffled) {
      audioPlayer.src = playlist[currentIndex];
    } else {
      audioPlayer.src = originalPlaylist[currentIndex];
    }
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause';
    const songName = (isShuffled ? playlist : originalPlaylist)[currentIndex].split('/').pop();
    currentSongEl.textContent = `Now playing: ${songName}`;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Fisher-Yates shuffle
    }
    return array;
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
});
/* 
    <div class="custom-player">
      <div class="window" style="width: 80%;">
        <div class="window-top-bar">music_player.exe<span class="fake-close">X</div>
        <div class="window-content" style="background-color: #ffba25ba;color:#331900">
          <span id="current-song">No song playing</span>
          <audio id="audio-player"></audio>
          <div class="controls">
            <button id="prev-btn">Prev</button>
            <button id="skip-backward-btn">-10s</button>
            <button id="play-pause-btn">Play </button>
            <button id="skip-forward-btn">+10s</button>
            <button id="next-btn">Next</button>
            <button id="loop-btn">[Loop:OFF]</button>
            <button id="shuffle-btn">[Shuffle:OFF]</button> <br>
            Volume:<input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
            <div class="progress-bar">
              <progress id="progress" value="0" max="100"></progress>
            </div>
            <span id="current-time">0:00</span>
            /
            <span id="duration">0:00</span>
          </div>
        </div>
      </div>
    </div>
*/