(function () {
  function initHeaderLayout() {
    const header = document.querySelector("[data-site-header]");
    if (!header) {
      return;
    }

    const root = document.documentElement;
    document.body.classList.add("has-fixed-header");

    function syncHeaderHeight() {
      const headerHeight = Math.ceil(header.getBoundingClientRect().height);
      if (headerHeight > 0) {
        root.style.setProperty("--site-header-height", headerHeight + "px");
      }
    }

    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight, { passive: true });

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(syncHeaderHeight);
      resizeObserver.observe(header);
    }
  }

  function initHeaderScrollState() {
    const header = document.querySelector("[data-site-header]");
    if (!header) {
      return;
    }

    let isTicking = false;
    let lastScrolledState = null;

    function applyState() {
      const isScrolled = window.scrollY > 8;
      if (isScrolled !== lastScrolledState) {
        header.classList.toggle("is-scrolled", isScrolled);
        lastScrolledState = isScrolled;
      }
    }

    function onScroll() {
      if (isTicking) {
        return;
      }

      isTicking = true;
      window.requestAnimationFrame(function () {
        applyState();
        isTicking = false;
      });
    }

    applyState();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initRevealAnimations() {
    const items = document.querySelectorAll("[data-animate]");
    if (!items.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initSmoothAnchors() {
    function getHeaderOffset() {
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"));
      return Number.isFinite(offset) ? offset : 0;
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") {
          return;
        }
        const target = document.querySelector(href);
        if (!target) {
          return;
        }
        event.preventDefault();
        const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
      });
    });
  }

  function setCurrentYear() {
    const year = document.getElementById("current-year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.EdversityComponents && typeof window.EdversityComponents.init === "function") {
      window.EdversityComponents.init();
    }
    initHeaderLayout();
    initHeaderScrollState();
    initRevealAnimations();
    initSmoothAnchors();
    setCurrentYear();
  });
})();
