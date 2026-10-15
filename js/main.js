/* Live Space interactions — no dependencies, safe to open from file:// */
(() => {
  "use strict";

  document.documentElement.classList.add("js-enabled");

  // Enter the WhatsApp number with country code and digits only when client details are confirmed.
  const whatsappNumber = "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");

  // The header sits over the page masthead and becomes opaque after scrolling.
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Mobile full-screen navigation with predictable keyboard focus and Escape support.
  const closeMenu = (restoreFocus = false) => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuToggle.focus();
  };
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
      navigation.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
      if (willOpen) navigation.querySelector("a")?.focus();
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
    document.addEventListener("keydown", (event) => {
      if (!navigation.classList.contains("is-open")) return;
      if (event.key === "Escape") closeMenu(true);
      if (event.key === "Tab") {
        const focusable = [...navigation.querySelectorAll("a[href]")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Reveal content as it enters view. Content remains visible without IntersectionObserver.
  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Count-up stats preserve their final text when scripting or motion is unavailable.
  const counters = [...document.querySelectorAll("[data-count]")];
  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    if (reduceMotion || !target) {
      element.textContent = `${new Intl.NumberFormat("en-IN").format(target)}${suffix}`;
      return;
    }
    const duration = 1250;
    const start = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${new Intl.NumberFormat("en-IN").format(Math.round(target * eased))}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) counters.forEach(animateCount);
    else {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.65 });
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  // Testimonials: buttons, pagination, touch swipe, and a pause-on-interaction timer.
  const slider = document.querySelector("[data-testimonial-slider]");
  if (slider) {
    const slides = [...slider.querySelectorAll(".testimonial-slide")];
    const dots = [...slider.querySelectorAll("[data-testimonial-dot]")];
    const previous = document.querySelector("[data-testimonial-prev]");
    const next = document.querySelector("[data-testimonial-next]");
    let current = 0;
    let timer;
    let touchStartX = 0;
    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === current)));
    };
    const stopAutoplay = () => window.clearInterval(timer);
    const startAutoplay = () => {
      stopAutoplay();
      if (!reduceMotion && !document.hidden) timer = window.setInterval(() => showSlide(current + 1), 6500);
    };
    previous?.addEventListener("click", () => { showSlide(current - 1); startAutoplay(); });
    next?.addEventListener("click", () => { showSlide(current + 1); startAutoplay(); });
    dots.forEach((dot) => dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.testimonialDot));
      startAutoplay();
    }));
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);
    slider.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) showSlide(current + (distance < 0 ? 1 : -1));
      startAutoplay();
    }, { passive: true });
    document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());
    showSlide(0);
    startAutoplay();
  }

  // Project filters keep their state announced to assistive technology.
  const portfolioGrid = document.querySelector("[data-portfolio-grid]");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const emptyState = document.querySelector("[data-portfolio-empty]");
  if (portfolioGrid && filterButtons.length) {
    const items = [...portfolioGrid.querySelectorAll("[data-category]")];
    filterButtons.forEach((button) => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      let visibleCount = 0;
      items.forEach((item) => {
        const visible = filter === "all" || item.dataset.category.split(/\s+/).includes(filter);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyState) emptyState.hidden = visibleCount > 0;
    }));
  }

  // Native dialog provides modal focus handling and Escape-to-close. Arrow keys/swipes browse.
  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && portfolioGrid) {
    const image = lightbox.querySelector("[data-lightbox-image]");
    const title = lightbox.querySelector("[data-lightbox-title]");
    const description = lightbox.querySelector("[data-lightbox-description]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const previousButton = lightbox.querySelector("[data-lightbox-prev]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    let currentItem = null;
    let lastTrigger = null;
    let touchStartX = 0;
    const visibleItems = () => [...portfolioGrid.querySelectorAll(".portfolio-item:not([hidden])")];
    const showItem = (item) => {
      if (!item) return;
      currentItem = item;
      const thumbnail = item.querySelector("img");
      image.src = item.dataset.full || thumbnail.src;
      image.alt = thumbnail.alt;
      title.textContent = item.dataset.title || "Live Space project";
      description.textContent = item.dataset.description || "";
    };
    const moveItem = (direction) => {
      const list = visibleItems();
      if (!list.length) return;
      let index = list.indexOf(currentItem);
      if (index < 0) index = 0;
      showItem(list[(index + direction + list.length) % list.length]);
    };
    portfolioGrid.addEventListener("click", (event) => {
      const item = event.target.closest(".portfolio-item");
      if (!item) return;
      lastTrigger = item;
      showItem(item);
      lightbox.showModal();
      closeButton.focus();
    });
    closeButton.addEventListener("click", () => lightbox.close());
    previousButton.addEventListener("click", () => moveItem(-1));
    nextButton.addEventListener("click", () => moveItem(1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => lastTrigger?.focus());
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") moveItem(-1);
      if (event.key === "ArrowRight") moveItem(1);
    });
    lightbox.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) moveItem(distance < 0 ? 1 : -1);
    }, { passive: true });
  }

  // Contact form performs accessible client-side validation. Connect a form endpoint to receive submissions.
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const feedback = contactForm.querySelector("[data-contact-feedback]");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      feedback.classList.remove("is-error");
      if (!contactForm.reportValidity()) {
        feedback.classList.add("is-error");
        feedback.textContent = "Please check the highlighted fields and try again.";
        return;
      }
      const name = new FormData(contactForm).get("name").trim();
      feedback.textContent = `Thank you, ${name}. Your enquiry is ready to send once a form service is connected.`;
      contactForm.reset();
    });
  }

  // Static newsletter form provides feedback but does not store addresses without a mailing-list service.
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const feedback = form.parentElement.querySelector("[data-newsletter-feedback]");
      if (feedback) feedback.textContent = "Thanks — connect your mailing list to complete sign-up.";
      form.reset();
    });
  });

  // Shared WhatsApp affordance uses a working enquiry fallback until a real studio number is set.
  const whatsappLink = document.querySelector("[data-whatsapp]");
  if (whatsappLink && /^\d{7,15}$/.test(whatsappNumber)) {
    whatsappLink.href = `https://wa.me/${whatsappNumber}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.setAttribute("aria-label", "Chat with Live Space on WhatsApp");
  }

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();
