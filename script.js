// ===== YouTube Player =====
let player;
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
      },
    },
  });
};

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
  dots.forEach(d => d.classList.toggle('theme-dark', current === 1));

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

// Wheel — cède la priorité au carrousel si la souris est dessus
let wheelCooldown = false;
document.addEventListener('wheel', (e) => {
  if (e.target.closest('.yt-grid-cat')) return; // géré par le carrousel
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
if (form) {
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
}

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

    var activeBlock = slide.querySelector(
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

// ===== Lightbox vidéo =====
(function () {
  var lb      = document.getElementById('yt-lightbox');
  var iframe  = document.getElementById('yt-lb-iframe');
  var overlay = document.getElementById('yt-lb-overlay');
  var closeBtn= document.getElementById('yt-lb-close');
  if (!lb) return;

  function open(id) {
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    lb.hidden = false;
  }

  function close() {
    lb.hidden = true;
    iframe.src = '';
  }

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  // Délégation : capture tout clic sur [data-yt-id]
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-yt-id]');
    if (!btn) return;
    // Pour le carrousel : n'ouvre que si la slide est active
    var parentSlide = btn.closest('.cat-slide');
    if (parentSlide && !parentSlide.classList.contains('active')) return;
    e.preventDefault();
    open(btn.dataset.ytId);
  });
})();

// ===== Catalogue Carousel 3D =====
(function () {
  var track   = document.getElementById('cat-track');
  var stage   = document.getElementById('cat-stage');
  var prevBtn = document.getElementById('cat-prev');
  var nextBtn = document.getElementById('cat-next');
  var fmtEl    = document.getElementById('cat-info-format');
  var titleEl  = document.getElementById('cat-info-title');
  var prodEl   = document.getElementById('cat-info-producteur');
  var realEl   = document.getElementById('cat-info-realisation');
  var scrubber = document.getElementById('cat-scrubber');
  var thumb    = document.getElementById('cat-scrubber-thumb');
  if (!track || !stage) return;

  var dirTimer = null;
  function flashDir(dir) {
    scrubber.classList.remove('dir-up', 'dir-down');
    void scrubber.offsetWidth;
    scrubber.classList.add('dir-' + dir);
    clearTimeout(dirTimer);
    dirTimer = setTimeout(function () {
      scrubber.classList.remove('dir-up', 'dir-down');
    }, 700);
  }

  var slides  = Array.from(track.querySelectorAll('.cat-slide'));
  var current = 2; // Démarre sur Ascension II

  // Paramètres 3D verticaux selon la distance au centre
  var PARAMS = [
    { tyRatio: 0,    rx:  0,  scale: 1,    opacity: 1,    z: 10 },  // centre
    { tyRatio: 0.62, rx: 48,  scale: 0.78, opacity: 0.68, z:  5 },  // ±1
    { tyRatio: 0.98, rx: 66,  scale: 0.55, opacity: 0.35, z:  2 },  // ±2
  ];

  function updateCarousel(animate) {
    var sh = slides[0].offsetHeight;
    var n  = slides.length;

    slides.forEach(function (s, i) {
      var dist = i - current;
      // Chemin circulaire le plus court
      if (dist > n / 2)  dist -= n;
      if (dist < -n / 2) dist += n;
      var absDist = Math.abs(dist);
      var sign    = dist >= 0 ? 1 : -1;
      var active  = dist === 0;
      var p       = PARAMS[Math.min(absDist, PARAMS.length - 1)];

      s.classList.toggle('active', active);

      if (!animate) s.style.transition = 'none';

      var ty = sign * p.tyRatio * sh;
      var rx = -sign * p.rx; // carte du bas incline vers le bas, carte du haut vers le haut

      if (absDist >= PARAMS.length) {
        s.style.opacity   = '0';
        s.style.zIndex    = '0';
      } else {
        s.style.opacity   = String(p.opacity);
        s.style.zIndex    = String(p.z);
      }
      s.style.transform = 'translate(-50%, calc(-50% + ' + ty + 'px)) rotateX(' + rx + 'deg) scale(' + p.scale + ')';

      if (!animate) {
        s.offsetHeight; // force reflow
        s.style.transition = '';
      }
    });

    var d = slides[current].dataset;
    fmtEl.textContent   = d.format;
    titleEl.textContent = d.title;
    prodEl.textContent  = d.producteur;
    realEl.textContent  = d.realisation;

    // Scrubber position
    var pct = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 50;
    thumb.style.top = pct + '%';

  }

  prevBtn.addEventListener('click', function () {
    flashDir('up');
    current = (current - 1 + slides.length) % slides.length;
    updateCarousel(true);
  });

  nextBtn.addEventListener('click', function () {
    flashDir('down');
    current = (current + 1) % slides.length;
    updateCarousel(true);
  });

  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function (e) {
      if (i !== current) {
        e.preventDefault();
        flashDir(i < current ? 'up' : 'down');
        current = i;
        updateCarousel(true);
      }
    });
  });

  // Molette sur la zone carrousel
  var catGrid = document.querySelector('.yt-grid-cat');
  if (catGrid) {
    var catWheelCooldown = false;
    catGrid.addEventListener('wheel', function (e) {
      e.stopPropagation();
      if (catWheelCooldown) return;
      catWheelCooldown = true;
      if (e.deltaY > 20) {
        flashDir('down'); current = (current + 1) % slides.length; updateCarousel(true);
      } else if (e.deltaY < -20) {
        flashDir('up'); current = (current - 1 + slides.length) % slides.length; updateCarousel(true);
      }
      setTimeout(function () { catWheelCooldown = false; }, 600);
    }, { passive: true });
  }

  // Recalcul quand le mode catalogue s'active
  var muSlide = document.getElementById('slide-musique');
  if (muSlide) {
    new MutationObserver(function () {
      requestAnimationFrame(function () { updateCarousel(false); });
    }).observe(muSlide, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('resize', function () { updateCarousel(false); });

  updateCarousel(false);
})();

// ===== Glitch k : mirror aléatoire =====
(function () {
  var k = document.querySelector('.glitch-k');
  if (!k) return;

  function triggerMirror() {
    k.classList.add('mirrored');
    // Durée du mirror : 60-160ms (très court, "flash")
    setTimeout(function () {
      k.classList.remove('mirrored');
    }, 60 + Math.random() * 100);

    // Parfois un double-flash rapide
    if (Math.random() < 0.35) {
      setTimeout(function () {
        k.classList.add('mirrored');
        setTimeout(function () { k.classList.remove('mirrored'); }, 50 + Math.random() * 60);
      }, 180 + Math.random() * 80);
    }

    // Prochain mirror dans 2-9 secondes
    setTimeout(triggerMirror, 2000 + Math.random() * 7000);
  }

  // Premier déclenchement après 1-4s
  setTimeout(triggerMirror, 1000 + Math.random() * 3000);
})();
