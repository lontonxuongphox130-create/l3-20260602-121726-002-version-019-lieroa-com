(function () {
  function preparePlayer(frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('.play-overlay');
    var stream = frame.getAttribute('data-stream');
    var initialized = false;

    function attach() {
      if (initialized || !video || !stream) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      attach();

      if (button) {
        button.classList.add('hidden');
      }

      var request = video.play();

      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('hidden');
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(preparePlayer);
})();
