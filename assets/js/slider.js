(function () {
  function initSlider(root) {
    const track = root.querySelector("[data-slider-track]");
    const slides = Array.from(root.querySelectorAll("[data-slide]"));
    const prev = root.querySelector("[data-slider-prev]");
    const next = root.querySelector("[data-slider-next]");
    const dots = Array.from(root.querySelectorAll("[data-slider-dot]"));

    if (!track || slides.length === 0) {
      return;
    }

    let index = 0;
    let timer = null;
    let touchStartX = 0;

    function update() {
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function goTo(nextIndex) {
      const total = slides.length;
      index = (nextIndex + total) % total;
      update();
    }

    function startAuto() {
      stopAuto();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, 5000);
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const slide = Number(dot.getAttribute("data-slider-dot"));
        if (Number.isFinite(slide)) {
          goTo(slide);
        }
      });
    });

    root.addEventListener(
      "touchstart",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) {
          return;
        }
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) {
          return;
        }
        const diff = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            goTo(index + 1);
          } else {
            goTo(index - 1);
          }
        }
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", startAuto);

    update();
    startAuto();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("testimonial-slider");
    if (slider) {
      initSlider(slider);
    }
  });
})();
