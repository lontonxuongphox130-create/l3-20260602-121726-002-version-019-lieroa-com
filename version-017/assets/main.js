(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));

  searchInputs.forEach(function (input) {
    var root = input.closest('main') || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
    var filterRoot = root.querySelector('[data-filters]');
    var filterValue = 'all';

    function apply() {
      var keyword = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();

        var matchesText = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilter = filterValue === 'all' || haystack.indexOf(filterValue.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(matchesText && matchesFilter));
      });
    }

    input.addEventListener('input', apply);

    if (filterRoot) {
      filterRoot.addEventListener('click', function (event) {
        var button = event.target.closest('[data-filter]');

        if (!button) {
          return;
        }

        filterValue = button.getAttribute('data-filter') || 'all';
        Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter]')).forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    }
  });
})();
