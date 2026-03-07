// ===== YouTube Player =====
let player;
let isMuted = false;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt-player', {
    videoId: 'e4VzGciFDxo',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: 'e4VzGciFDxo',
      controls: 0,
      showinfo: 0,
      rel: 0,
      mute: 1,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: (e) => {
        e.target.mute();
        e.target.playVideo();
        isMuted = true;
        updateMuteIcon();
      },
    },
  });
};

// Mute toggle
const muteBtn = document.getElementById('mute-btn');
const iconUnmuted = document.getElementById('icon-unmuted');
const iconMuted = document.getElementById('icon-muted');

function updateMuteIcon() {
  iconUnmuted.style.display = isMuted ? 'none' : 'block';
  iconMuted.style.display = isMuted ? 'block' : 'none';
}

muteBtn.addEventListener('click', () => {
  if (!player) return;
  if (isMuted) {
    player.unMute();
    player.setVolume(80);
    isMuted = false;
  } else {
    player.mute();
    isMuted = true;
  }
  updateMuteIcon();
});

// ===== Slider =====
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');
let current = 0;
let isAnimating = false;

function goTo(index) {
  if (isAnimating || index === current || index < 0 || index >= slides.length) return;
  isAnimating = true;

  const goingDown = index > current;
  const outgoing = slides[current];
  const incoming = slides[index];

  if (!goingDown) {
    // Incoming comes from above: place it there instantly, then animate to 0
    incoming.style.transition = 'none';
    incoming.style.transform = 'translateY(-100%)';
    incoming.offsetHeight; // force reflow
    incoming.style.transition = '';
    incoming.style.transform = '';
  }

  outgoing.classList.remove('active');
  if (goingDown) outgoing.classList.add('exit-up');

  incoming.classList.add('active');
  dots[current].classList.remove('active');
  current = index;
  dots[current].classList.add('active');

  // Arrow visibility
  arrowUp.classList.toggle('hidden', current === 0);
  arrowDown.classList.toggle('hidden', current === slides.length - 1);

  setTimeout(() => {
    outgoing.classList.remove('exit-up');
    outgoing.style.transition = '';
    outgoing.style.transform = '';
    isAnimating = false;
  }, 600);
}

// Dots
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goTo(i));
});

// Arrows
arrowUp.addEventListener('click', () => goTo(current - 1));
arrowDown.addEventListener('click', () => goTo(current + 1));

// Nav links
document.querySelectorAll('[data-slide]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(el.dataset.slide));
  });
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(current - 1);
});

// Wheel
let wheelCooldown = false;
document.addEventListener('wheel', (e) => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  if (e.deltaY > 30) goTo(current + 1);
  else if (e.deltaY < -30) goTo(current - 1);
  setTimeout(() => { wheelCooldown = false; }, 900);
}, { passive: true });

// Touch
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) {
    diff > 0 ? goTo(current + 1) : goTo(current - 1);
  }
}, { passive: true });

// Init arrows
arrowUp.classList.add('hidden');

// ===== Contact form =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'MERCI !';
  btn.disabled = true;
  form.reset();
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 3000);
});

// ===== Catalogue Toggle =====
(function () {
  const slide = document.getElementById('slide-musique');
  const btn   = document.getElementById('catalogue-toggle');
  if (!slide || !btn) return;

  let isCatalogue = false;
  let animating   = false;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (animating) return;
    animating = true;

    // Glitch sur le titre actuellement visible
    const activeBlock = slide.querySelector(
      isCatalogue ? '.slide-text-cat' : '.slide-text-main'
    );
    activeBlock.classList.add('glitching');

    // Au pic du glitch → bascule les classes (vidéos + texte)
    setTimeout(function () {
      isCatalogue = !isCatalogue;
      slide.classList.toggle('catalogue-mode', isCatalogue);
      btn.textContent = isCatalogue ? 'Mes dernières créations' : 'Catalogue';
    }, 200);

    // Fin du glitch → nettoyage
    setTimeout(function () {
      activeBlock.classList.remove('glitching');
      animating = false;
    }, 460);
  });
})();
