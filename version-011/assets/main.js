(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    all('[data-menu-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var panel = document.querySelector('[data-mobile-panel]');
            if (panel) {
                panel.classList.toggle('is-open');
            }
        });
    });

    var slides = all('[data-hero-slide]');
    var dots = all('[data-hero-dot]');
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
        });
    }

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    all('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var select = scope.querySelector('[data-filter-select]');
        var count = scope.querySelector('[data-filter-count]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (input && initial) {
            input.value = initial;
        }

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var option = select ? select.value.trim().toLowerCase() : '';
            var cards = all('.movie-card, .rank-card', document);
            var visible = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var okKeyword = !keyword || text.indexOf(keyword) !== -1;
                var okOption = !option || text.indexOf(option) !== -1;
                var ok = okKeyword && okOption;
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible ? visible + ' 条相关内容' : '暂无匹配内容';
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }
        if (select) {
            select.addEventListener('change', applyFilter);
        }
        applyFilter();
    });

    all('[data-player]').forEach(function (shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('[data-play]');
        if (!video || !button) {
            return;
        }

        function prepareAndPlay() {
            var stream = video.getAttribute('data-stream');
            if (stream && !video.getAttribute('data-ready')) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    video.setAttribute('data-ready', '1');
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    video.setAttribute('data-ready', '1');
                } else {
                    video.src = stream;
                    video.setAttribute('data-ready', '1');
                }
            }
            shell.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        button.addEventListener('click', prepareAndPlay);
        video.addEventListener('click', function () {
            if (video.paused) {
                prepareAndPlay();
            }
        });
    });
})();
