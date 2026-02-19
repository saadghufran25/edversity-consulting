(function () {
  const config = window.EDVERSITY_CONFIG || {};

  const navItems = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "contact.html", label: "Contact" },
    { href: "https://www.edversity.com.pk", label: "Visit Edversity", external: true }
  ];
  const logoHeaderSrc = "assets/images/white background logo.png";
  const logoFooterSrc = "assets/images/dark background logo.png";
  const logoAlt = "Edversity Consulting";

  function getCurrentPath() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function navLinksMarkup(className) {
    return navItems
      .map(function (item) {
        const pathAttr = item.external ? "" : ' data-nav-path="' + item.href + '"';
        const externalAttrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return '<a class="' + className + '"' + pathAttr + ' href="' + item.href + '"' + externalAttrs + ">" + item.label + "</a>";
      })
      .join("");
  }

  function renderNav() {
    const mount = document.getElementById("site-nav");
    if (!mount) {
      return;
    }

    mount.innerHTML =
      '<header class="site-header" data-site-header>' +
      '  <div class="container">' +
      '    <div class="nav-shell">' +
      '      <a class="brand" href="index.html" aria-label="Edversity Consulting home">' +
      '        <img class="brand-logo" src="' + logoHeaderSrc + '" alt="' + logoAlt + '">' +
      "      </a>" +
      '      <nav class="desktop-nav" aria-label="Primary">' +
      navLinksMarkup("nav-link") +
      "      </nav>" +
      '      <div class="nav-cta">' +
      '        <a class="btn btn-primary btn-sm" href="apply.html">Apply Now</a>' +
      "      </div>" +
      '      <button class="nav-toggle" data-nav-toggle aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav">' +
      '        <span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>' +
      "      </button>" +
      "    </div>" +
      '    <nav class="mobile-nav" id="mobile-nav" data-mobile-nav hidden aria-label="Mobile primary">' +
      navLinksMarkup("nav-link") +
      '      <a class="btn btn-primary btn-sm" href="apply.html">Apply Now</a>' +
      "    </nav>" +
      "  </div>" +
      "</header>";

    const current = getCurrentPath();
    mount.querySelectorAll("[data-nav-path]").forEach(function (link) {
      if (link.getAttribute("data-nav-path") === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });

    const header = mount.querySelector("[data-site-header]");
    const toggle = mount.querySelector("[data-nav-toggle]");
    const mobileNav = mount.querySelector("[data-mobile-nav]");

    if (!toggle || !mobileNav || !header) {
      return;
    }

    function closeMenu() {
      header.classList.remove("menu-open");
      mobileNav.hidden = true;
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("menu-open");
      mobileNav.hidden = !isOpen;
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  function renderMobileCta() {
    const mount = document.getElementById("mobile-cta");
    if (!mount) {
      return;
    }

    mount.innerHTML = '<a class="btn btn-primary mobile-apply" href="apply.html">Apply Now</a>';
    document.body.classList.add("page-has-mobile-cta");
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) {
      return;
    }

    const officeEmail = config.officeEmail || "consulting@edversity.com.pk";
    const whatsAppUrl = config.whatsAppUrl || "#";
    const social = config.socialLinks || {};

    mount.innerHTML =
      '<footer class="footer">' +
      '  <div class="container footer-main" data-animate>' +
      '    <div class="footer-brand-col stack-4">' +
      '      <a class="brand footer-brand" href="index.html"><img class="brand-logo brand-logo-footer" src="' + logoFooterSrc + '" alt="' + logoAlt + '"></a>' +
      '      <p class="footer-lead">Your journey to global education, professionally managed with precision.</p>' +
      '      <div class="footer-social">' +
      '        <a class="social-link" href="' + (social.instagram || "#") + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src="assets/icons/instagram.svg" alt="" aria-hidden="true"></a>' +
      '        <a class="social-link" href="' + (social.linkedin || "#") + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="assets/icons/linkedin.svg" alt="" aria-hidden="true"></a>' +
      "      </div>" +
      "    </div>" +
      '    <div class="footer-nav-cols">' +
      '      <div class="footer-col">' +
      '        <h4 class="footer-col-title">Explore</h4>' +
      '        <ul class="footer-list">' +
      '          <li><a href="index.html">Home</a></li>' +
      '          <li><a href="about.html">About</a></li>' +
      '          <li><a href="services.html">Services</a></li>' +
      '          <li><a href="contact.html">Contact</a></li>' +
      '          <li><a href="https://www.edversity.com.pk" target="_blank" rel="noopener noreferrer">Visit Edversity</a></li>' +
      "        </ul>" +
      "      </div>" +
      '      <div class="footer-col">' +
      '        <h4 class="footer-col-title">Contact</h4>' +
      '        <ul class="footer-list footer-contact-list">' +
      '          <li><a class="footer-contact-link" data-office-email href="mailto:' + officeEmail + '"><span class="footer-link-icon"><img src="assets/icons/mail.svg" alt="" aria-hidden="true"></span><span data-office-email-text>' + officeEmail + "</span></a></li>" +
      '          <li><a class="footer-contact-link" href="' + whatsAppUrl + '" target="_blank" rel="noopener noreferrer"><span class="footer-link-icon"><img src="assets/icons/whatsapp.svg" alt="" aria-hidden="true"></span><span>WhatsApp</span></a></li>' +
      '          <li><a class="footer-contact-link" href="apply.html"><span class="footer-link-icon"><img src="assets/icons/calendar.svg" alt="" aria-hidden="true"></span><span>Apply Now</span></a></li>' +
      "        </ul>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      '  <div class="container">' +
      '    <div class="footer-bottom">' +
      '      <span>&copy; <span id="current-year"></span> Edversity Consulting. All rights reserved.</span>' +
      "      <span>Admissions strategy, documentation, and visa lifecycle support.</span>" +
      "    </div>" +
      "  </div>" +
      "</footer>";
  }

  function renderCtaBands() {
    const bands = document.querySelectorAll("[data-cta-band]");
    if (!bands.length) {
      return;
    }

    bands.forEach(function (band) {
      const title = band.getAttribute("data-title") || "Ready to accelerate your global education plan?";
      const text =
        band.getAttribute("data-text") ||
        "Choose the right package, build stronger applications, and move forward with structured expert support.";

      band.innerHTML =
        '<div class="container">' +
        '  <div class="cta-band" data-animate>' +
        "    <div>" +
        '      <h2 class="section-title">' + title + "</h2>" +
        "      <p>" + text + "</p>" +
        "    </div>" +
        '    <div class="cta-row">' +
        '      <a class="btn btn-primary btn-wide" href="apply.html">Apply Now</a>' +
        "    </div>" +
        "  </div>" +
        "</div>";
    });
  }

  function populateConfigTargets() {
    const officeEmail = config.officeEmail || "consulting@edversity.com.pk";
    const whatsAppUrl = config.whatsAppUrl || "#";
    const bookingUrl = config.bookingUrl || "#";
    const mapEmbedUrl = config.mapEmbedUrl || "";
    const social = config.socialLinks || {};

    document.querySelectorAll("[data-office-email]").forEach(function (el) {
      if (el.tagName === "A") {
        el.href = "mailto:" + officeEmail;
        const emailText = el.querySelector("[data-office-email-text]");
        if (emailText) {
          emailText.textContent = officeEmail;
          return;
        }
      }
      el.textContent = officeEmail;
    });

    document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
      if (el.tagName === "A") {
        el.href = whatsAppUrl;
      }
    });

    document.querySelectorAll("[data-booking-link]").forEach(function (el) {
      if (el.tagName === "A") {
        el.href = bookingUrl;
      }
    });

    document.querySelectorAll("[data-social-link]").forEach(function (el) {
      const key = el.getAttribute("data-social-link");
      if (el.tagName === "A" && key && social[key]) {
        el.href = social[key];
      }
    });

    document.querySelectorAll("[data-map-embed]").forEach(function (el) {
      if (el.tagName === "IFRAME" && mapEmbedUrl) {
        el.src = mapEmbedUrl;
      }
    });
  }

  window.EdversityComponents = {
    init: function () {
      renderNav();
      renderMobileCta();
      renderFooter();
      renderCtaBands();
      populateConfigTargets();
    }
  };
})();
