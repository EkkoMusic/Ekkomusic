// Language toggle — sets localStorage and updates href on the FR/EN buttons
(function () {
  var en = document.getElementById('lang-en');
  var fr = document.getElementById('lang-fr');
  var p  = location.pathname;

  if (en) {
    en.href = '/en' + p;
    en.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.setItem('ekko_lang', 'en');
      location.href = '/en' + p;
    });
  }

  if (fr) {
    var fp = p.replace(/^\/en/, '') || '/';
    fr.href = fp;
    fr.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.setItem('ekko_lang', 'fr');
      location.href = fp;
    });
  }
})();
