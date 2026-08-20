const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("[data-nav-menu]");
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");
const revealItems = document.querySelectorAll(".reveal");
const backToTop = document.querySelector(".back-to-top");
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const year = document.querySelector("#year");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");

// Dark / light theme toggle
const savedTheme = localStorage.getItem("darshanfx-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains("dark-theme");

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("darshanfx-theme", isDark ? "dark" : "light");

    updateThemeIcon();
  });
}



if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!navToggle || !navMenu) return;

  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* Portfolio filter */
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    workCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);

      // Keep cards polished when filters are clicked
      if (shouldShow) {
        card.classList.add("is-visible");
      }
    });
  });
});

/* Premium scroll reveal */
function setupRevealAnimation() {
  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    const delay = Math.min((index % 6) * 70, 350);
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

setupRevealAnimation();

/* Back to top */
function handleScroll() {
  if (!backToTop) return;
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Contact form mailto */
// if (form && formStatus) {
//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     if (!form.checkValidity()) {
//       formStatus.textContent = "Please complete the required fields before sending.";
//       form.reportValidity();
//       return;
//     }

//     const data = new FormData(form);
//     const subject = encodeURIComponent(`DarshanFx project request: ${data.get("service")}`);
//     const body = encodeURIComponent(
//       `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nProject details:\n${data.get("message")}`
//     );

//     formStatus.textContent = "Opening your email app with the project details.";
//     window.location.href = `mailto:
// ubject=${subject}&body=${body}`;
//   });
// }
if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formStatus.textContent = "Please complete all required fields.";
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    const name = data.get("name");
    const email = data.get("email");
    const service = data.get("service");
    const message = data.get("message");

    const whatsappMessage =
      `Hi DarshanFx, I want to start a design project.%0A%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Email: ${encodeURIComponent(email)}%0A` +
      `Project Type: ${encodeURIComponent(service)}%0A%0A` +
      `Project Details:%0A${encodeURIComponent(message)}`;

    const whatsappURL = `https://wa.me/918503925764?text=${whatsappMessage}`;

    formStatus.textContent = "Opening WhatsApp with your project details...";
    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    form.reset();
  });
}
// Image preview modal / lightbox
const imageModal = document.querySelector("[data-image-modal]");
const imageModalImg = document.querySelector("[data-image-modal-img]");
const imageModalCaption = document.querySelector("[data-image-modal-caption]");
const imageModalClose = document.querySelector("[data-image-modal-close]");

const previewImages = document.querySelectorAll(
  ".work-card img, .mockup-image img"
);

function openImageModal(image) {
  if (!imageModal || !imageModalImg || !imageModalCaption) return;

  const card = image.closest(".work-card, .mockup-card");
  const title = card?.querySelector("h3, strong")?.textContent?.trim();
  const category = card?.querySelector("span")?.textContent?.trim();

  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt || "Design preview";

  imageModalCaption.textContent = title
    ? `${category ? category + " — " : ""}${title}`
    : image.alt || "Design preview";

  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) return;

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  imageModalImg.src = "";
  imageModalImg.alt = "";
}

previewImages.forEach((image) => {
  image.addEventListener("click", () => openImageModal(image));
});

if (imageModalClose) {
  imageModalClose.addEventListener("click", closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageModal();
  }
});


// Project multi-image gallery modal
const projectModal = document.querySelector("[data-project-modal]");
const projectClose = document.querySelector("[data-project-close]");
const projectMainImg = document.querySelector("[data-project-main-img]");
const projectTitle = document.querySelector("[data-project-title]");
const projectCategory = document.querySelector("[data-project-category]");
const projectDescription = document.querySelector("[data-project-description]");
const projectThumbnails = document.querySelector("[data-project-thumbnails]");
const projectPrev = document.querySelector("[data-project-prev]");
const projectNext = document.querySelector("[data-project-next]");
const projectButtons = document.querySelectorAll("[data-project]");

const projectGalleries = {
  "event-launch": {
    title: "Event Launch Poster",
    category: "Posters",
    description: "A complete poster design project with multiple campaign variations and visual directions.",
    images: [
      "assets/images/projects/event-launch/1.webp",
      "assets/images/projects/event-launch/2.webp",
      "assets/images/projects/event-launch/3.webp",
    ]
  },

  "youtube-thumbnail": {
    title: "Creator Video Thumbnail",
    category: "Thumbnails",
    description: "Thumbnail design variations focused on contrast, clarity, and scroll-stopping visual impact.",
    images: [
      "assets/images/projects/youtube-thumbnail/1.webp",
      "assets/images/projects/youtube-thumbnail/2.webp",
      "assets/images/projects/youtube-thumbnail/3.webp", 
      "assets/images/projects/youtube-thumbnail/4.webp",
      "assets/images/projects/youtube-thumbnail/5.webp"
    ]
  },

  "branding": {
    title: "Business Brand Graphics",
    category: "Branding",
    description: "Branding graphics, mockups, identity previews, and professional visual presentation.",
    images: [
      "assets/images/projects/branding/1.webp",
      "assets/images/projects/branding/2.webp",
      "assets/images/projects/branding/3.webp"
    ]
  },

  "social-media": {
    title: "Promotion Creative Set",
    category: "Social Media",
    description: "A set of social media creatives designed for promotional campaigns and brand communication.",
    images: [
      "assets/images/projects/social-media/1.webp",
      "assets/images/projects/social-media/2.webp",
      "assets/images/projects/social-media/3.webp",
      "assets/images/projects/social-media/4.webp",
      "assets/images/projects/social-media/5.webp",
      "assets/images/projects/social-media/6.webp",
    ]
  },

 "mockup": {
  title: "Premium Mockup Presentation",
  category: "Mockups",
  description: "Mockup presentation images showing how the final design looks in realistic placements.",
  images: [
    "assets/images/projects/mockup/1.webp",
    "assets/images/projects/mockup/2.webp",
    "assets/images/projects/mockup/3.webp",
    "assets/images/projects/mockup/4.webp",
    "assets/images/projects/mockup/5.webp",
    "assets/images/projects/mockup/6.webp",
    "assets/images/projects/mockup/7.webp",
    "assets/images/projects/mockup/8.webp",
  ]
},

  "political-poster": {
    title: "Public Campaign Poster",
    category: "Posters",
    description: "Political and public campaign poster visuals with clear message hierarchy.",
    images: [
      "assets/images/projects/political-poster/1.webp",
      "assets/images/projects/political-poster/2.webp",
      "assets/images/projects/political-poster/3.webp",
      "assets/images/projects/political-poster/4.webp",
      "assets/images/projects/political-poster/5.webp"
    ]
  }
};

let activeProject = null;
let activeProjectIndex = 0;

function renderProjectImage() {
  if (!activeProject || !projectMainImg || !projectThumbnails) return;

  const imageSrc = activeProject.images[activeProjectIndex];

  projectMainImg.src = imageSrc;
  projectMainImg.alt = `${activeProject.title} preview ${activeProjectIndex + 1}`;

  projectThumbnails.innerHTML = "";

  activeProject.images.forEach((src, index) => {
    const thumbButton = document.createElement("button");
    thumbButton.className = `project-thumb ${index === activeProjectIndex ? "is-active" : ""}`;
    thumbButton.type = "button";
    thumbButton.setAttribute("aria-label", `Open image ${index + 1}`);

    thumbButton.innerHTML = `<img src="${src}" alt="">`;

    thumbButton.addEventListener("click", () => {
      activeProjectIndex = index;
      renderProjectImage();
    });

    projectThumbnails.appendChild(thumbButton);
  });
}

function openProjectModal(projectId) {
  const project = projectGalleries[projectId];
  if (!project || !projectModal) return;

  activeProject = project;
  activeProjectIndex = 0;

  if (projectTitle) projectTitle.textContent = project.title;
  if (projectCategory) projectCategory.textContent = project.category;
  if (projectDescription) projectDescription.textContent = project.description;

  renderProjectImage();

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("project-modal-open");
}

function closeProjectModal() {
  if (!projectModal || !projectMainImg) return;

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("project-modal-open");

  projectMainImg.src = "";
  activeProject = null;
  activeProjectIndex = 0;
}

function showProjectNext() {
  if (!activeProject) return;
  activeProjectIndex = (activeProjectIndex + 1) % activeProject.images.length;
  renderProjectImage();
}

function showProjectNext() {
  if (!activeProject) return;

  if (activeProjectIndex < activeProject.images.length - 1) {
    activeProjectIndex++;
    renderProjectImage();
  }
}

function showProjectPrev() {
  if (!activeProject) return;

  if (activeProjectIndex > 0) {
    activeProjectIndex--;
    renderProjectImage();
  }
}


projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openProjectModal(button.dataset.project);
  });
});

if (projectNext) projectNext.addEventListener("click", showProjectNext);
if (projectPrev) projectPrev.addEventListener("click", showProjectPrev);
if (projectClose) projectClose.addEventListener("click", closeProjectModal);

if (projectModal) {
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      closeProjectModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!projectModal?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeProjectModal();
  if (event.key === "ArrowRight") showProjectNext();
  if (event.key === "ArrowLeft") showProjectPrev();
});
// Count-up animation: runs every time stats section enters viewport
const countNumbers = document.querySelectorAll(".count-number");
const runningAnimations = new Map();

function resetCounter(counter) {
  const suffix = counter.dataset.suffix || "";
  counter.textContent = `0${suffix}`;
}

function animateCount(counter) {
  const target = Number(counter.dataset.count);
  const suffix = counter.dataset.suffix || "";
  const duration = target > 100 ? 1600 : 900;

  if (runningAnimations.has(counter)) {
    cancelAnimationFrame(runningAnimations.get(counter));
  }

  let startTime = null;

  function updateCount(currentTime) {
    if (!startTime) startTime = currentTime;

    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easedProgress * target);

    counter.textContent = `${currentValue}${suffix}`;

    if (progress < 1) {
      const frameId = requestAnimationFrame(updateCount);
      runningAnimations.set(counter, frameId);
    } else {
      counter.textContent = `${target}${suffix}`;
      runningAnimations.delete(counter);
    }
  }

  resetCounter(counter);
  const frameId = requestAnimationFrame(updateCount);
  runningAnimations.set(counter, frameId);
}

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const counter = entry.target;

        if (entry.isIntersecting) {
          animateCount(counter);
        } else {
          resetCounter(counter);
        }
      });
    },
    {
      threshold: 0.45,
    }
  );

  countNumbers.forEach((counter) => {
    resetCounter(counter);
    countObserver.observe(counter);
  });
}
const ring = document.createElement("div");
ring.classList.add("cursor-ring");

const dot = document.createElement("div");
dot.classList.add("cursor-dot");

document.body.appendChild(ring);
document.body.appendChild(dot);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;

  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";

  requestAnimationFrame(animateRing);
}

animateRing();

document
  .querySelectorAll("a, button, .btn, .work-card")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("cursor-hover");
    });

    el.addEventListener("mouseleave", () => {
      ring.classList.remove("cursor-hover");
    });
  });/* ==========================================
   AUTO SET WORK CARD COVER IMAGES
   Paste at END of script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".project-preview-btn").forEach((btn) => {

    const projectId = btn.dataset.project;

    if (!projectGalleries[projectId]) return;

    const card = btn.closest(".work-card");
    if (!card) return;

    const img = card.querySelector("img");
    if (!img) return;

    // Use first gallery image as card cover
    img.src = projectGalleries[projectId].images[0];

    img.loading = "lazy";
    img.decoding = "async";

    img.onerror = () => {
      console.warn("Image not found:", img.src);
    };

  });

});/* =====================================================
   AUTO COLLAGE THUMBNAIL FOR EVERY PROJECT CARD
   Paste at the very END of script.js
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const MAX_VISIBLE_IMAGES = 6;

  document.querySelectorAll(".work-card").forEach((card) => {
    const projectButton = card.querySelector("[data-project]");
    const oldCoverImage = card.querySelector(":scope > img");

    if (!projectButton || !oldCoverImage) return;

    const projectId = projectButton.dataset.project;
    const project = projectGalleries[projectId];

    if (
      !project ||
      !Array.isArray(project.images) ||
      project.images.length === 0
    ) {
      return;
    }

    // Duplicate collage banne se rokega
    if (card.querySelector(".auto-project-collage")) return;

    const collage = document.createElement("div");
    collage.className = "auto-project-collage";

    const visibleImages = project.images.slice(0, MAX_VISIBLE_IMAGES);
    collage.dataset.count = String(visibleImages.length);

    visibleImages.forEach((imageSrc, index) => {
      const item = document.createElement("button");

      item.type = "button";
      item.className = "auto-collage-item";
      item.setAttribute(
        "aria-label",
        `Open ${project.title} image ${index + 1}`
      );

      const image = document.createElement("img");
      image.src = imageSrc;
      image.alt = `${project.title} image ${index + 1}`;
      image.loading = "lazy";
      image.decoding = "async";

      // Broken image hone par tile hide hoga
      image.addEventListener("error", () => {
        item.classList.add("image-error");
      });

      item.appendChild(image);

      // Jis thumbnail par click karoge, modal usi image se open hoga
      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        openProjectModal(projectId);

        activeProjectIndex = index;
        renderProjectImage();
      });

      collage.appendChild(item);
    });

    // 6 se zyada images hone par last tile par +count
    if (project.images.length > MAX_VISIBLE_IMAGES) {
      const lastItem = collage.lastElementChild;

      if (lastItem) {
        const extraCount = document.createElement("span");
        extraCount.className = "auto-collage-more";
        extraCount.textContent =
          `+${project.images.length - MAX_VISIBLE_IMAGES}`;

        lastItem.appendChild(extraCount);
      }
    }

    // Purani single cover image ki jagah collage
    oldCoverImage.replaceWith(collage);
  });
});/* =========================================
   PREMIUM GLASS CURSOR
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportsCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!supportsCustomCursor) return;

  document.body.classList.add("custom-glass-cursor");

  const cursor = document.createElement("div");
  cursor.className = "glass-cursor";

  const label = document.createElement("span");
  label.className = "glass-cursor-label";
  label.textContent = "View";

  cursor.appendChild(label);
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.add("is-visible");
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
  });

  document.addEventListener("mouseover", (event) => {
    const target = event.target.closest(
      "a, button, .work-card, .card-gallery-item, .auto-collage-item"
    );

    cursor.classList.toggle("is-active", Boolean(target));

    if (!target) return;

    if (target.closest(".project-preview-btn, .work-card")) {
      label.textContent = "View";
    } else if (target.closest("a")) {
      label.textContent = "Open";
    } else if (target.closest("button")) {
      label.textContent = "Click";
    }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.transform =
      `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
});/* REMOVE CURSOR LABEL TEXT */

document.addEventListener("DOMContentLoaded", () => {
  const label = document.querySelector(".glass-cursor-label");

  if (label) {
    label.remove();
  }
});/* REMOVE ALL CUSTOM CURSORS */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove(
    "custom-cursor",
    "custom-glass-cursor"
  );

  document
    .querySelectorAll(
      ".cursor-ring, .cursor-dot, .glass-cursor, .glass-cursor-label"
    )
    .forEach((element) => element.remove());
});/* =====================================
   FINAL: REMOVE EVERY CUSTOM CURSOR
   ===================================== */

(() => {
  const cursorSelectors =
    ".cursor-ring, .cursor-dot, .glass-cursor, .glass-cursor-label";

  function removeCustomCursor() {
    document.body.classList.remove(
      "custom-cursor",
      "custom-glass-cursor"
    );

    document
      .querySelectorAll(cursorSelectors)
      .forEach((element) => element.remove());
  }

  removeCustomCursor();

  document.addEventListener("DOMContentLoaded", removeCustomCursor);

  /* Purana code cursor dobara banaye to turant remove hoga */
  const cursorObserver = new MutationObserver(removeCustomCursor);

  cursorObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();/* =========================================================
   15 AUGUST PROJECT — AUTO ADD
   Paste this entire code at the END of script.js
========================================================= */

(function () {
    "use strict";

    // Prevent duplicate project
    if (document.getElementById("aug15-project-card")) return;

    const images = [
        "15-August/images/1.webp",
        "15-August/images/2.webp",
        "15-August/images/3.webp",
        "15-August/images/4.webp",
        "15-August/images/5.webp",
        "15-August/images/6.webp",
        "15-August/images/7.webp",
        "15-August/images/8.webp",
        "15-August/images/9.webp",
        "15-August/images/10.webp",
        "15-August/images/11.webp",
        "15-August/images/12.webp",
        "15-August/images/13.webp"
    ];

    /* ---------------------------------------------------------
       FIND EXISTING PROJECT GRID
    --------------------------------------------------------- */

    const projectGrid =
        document.querySelector(".projects-grid") ||
        document.querySelector(".portfolio-grid") ||
        document.querySelector(".work-grid") ||
        document.querySelector("#projects .grid") ||
        document.querySelector("#work .grid") ||
        document.querySelector("#projects") ||
        document.querySelector("#work");

    if (!projectGrid) {
        console.warn("15 August: Project grid not found.");
        return;
    }

    /* ---------------------------------------------------------
       CREATE CARD
    --------------------------------------------------------- */

    const card = document.createElement("article");

    card.id = "aug15-project-card";
    card.className = "project-card aug15-project-card";

    card.innerHTML = `
        <div class="aug15-cover">
            <div class="aug15-collage"></div>

            <div class="aug15-overlay">
                <span class="aug15-category">POSTERS</span>
                <h3>15 August</h3>
                <p>Independence Day creative collection</p>

                <span class="aug15-arrow">↗</span>
            </div>
        </div>
    `;

    projectGrid.appendChild(card);

    /* ---------------------------------------------------------
       COLLAGE
    --------------------------------------------------------- */

    const collage = card.querySelector(".aug15-collage");

    const collageImages = images.slice(0, 6);

    collageImages.forEach((src, index) => {
        const img = document.createElement("img");

        img.src = src;
        img.alt = `15 August Design ${index + 1}`;
        img.loading = "lazy";

        collage.appendChild(img);
    });

    /* ---------------------------------------------------------
       MODAL
    --------------------------------------------------------- */

    const modal = document.createElement("div");

    modal.id = "aug15-modal";

    modal.innerHTML = `
        <div class="aug15-modal-backdrop"></div>

        <div class="aug15-modal-box">

            <button class="aug15-close" aria-label="Close">
                ×
            </button>

            <div class="aug15-modal-header">
                <div>
                    <span>POSTERS</span>
                    <h2>15 August</h2>
                    <p>Independence Day creative collection</p>
                </div>

                <div class="aug15-counter">
                    <span id="aug15-current">1</span>
                    /
                    <span>${images.length}</span>
                </div>
            </div>

            <div class="aug15-main-image-wrap">

                <button
                    class="aug15-nav aug15-prev"
                    aria-label="Previous image"
                >
                    ‹
                </button>

                <img
                    id="aug15-main-image"
                    src="${images[0]}"
                    alt="15 August Design"
                >

                <button
                    class="aug15-nav aug15-next"
                    aria-label="Next image"
                >
                    ›
                </button>

            </div>

            <div class="aug15-thumbnails"></div>

        </div>
    `;

    document.body.appendChild(modal);

    /* ---------------------------------------------------------
       MODAL ELEMENTS
    --------------------------------------------------------- */

    const mainImage = modal.querySelector("#aug15-main-image");
    const currentCounter = modal.querySelector("#aug15-current");
    const thumbnails = modal.querySelector(".aug15-thumbnails");

    const closeBtn = modal.querySelector(".aug15-close");
    const prevBtn = modal.querySelector(".aug15-prev");
    const nextBtn = modal.querySelector(".aug15-next");
    const backdrop = modal.querySelector(".aug15-modal-backdrop");

    let currentIndex = 0;

    /* ---------------------------------------------------------
       THUMBNAILS
    --------------------------------------------------------- */

    images.forEach((src, index) => {

        const thumb = document.createElement("button");

        thumb.className = "aug15-thumb";

        thumb.innerHTML = `
            <img
                src="${src}"
                alt="15 August ${index + 1}"
                loading="lazy"
            >
        `;

        thumb.addEventListener("click", function () {
            showImage(index);
        });

        thumbnails.appendChild(thumb);
    });

    const thumbnailButtons =
        thumbnails.querySelectorAll(".aug15-thumb");

    /* ---------------------------------------------------------
       SHOW IMAGE
    --------------------------------------------------------- */

    function showImage(index) {

        if (index < 0) index = 0;
        if (index >= images.length) index = images.length - 1;

        currentIndex = index;

        mainImage.src = images[currentIndex];

        currentCounter.textContent = currentIndex + 1;

        thumbnailButtons.forEach((button, i) => {
            button.classList.toggle(
                "active",
                i === currentIndex
            );
        });

        // Don't wrap previous/next
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === images.length - 1;
    }

    /* ---------------------------------------------------------
       OPEN MODAL
    --------------------------------------------------------- */

    function openModal() {

        showImage(0);

        modal.classList.add("active");

        document.body.classList.add("aug15-modal-open");
    }

    /* ---------------------------------------------------------
       CLOSE MODAL
    --------------------------------------------------------- */

    function closeModal() {

        modal.classList.remove("active");

        document.body.classList.remove("aug15-modal-open");
    }

    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */

    card.addEventListener("click", openModal);

    closeBtn.addEventListener("click", closeModal);

    backdrop.addEventListener("click", closeModal);

    prevBtn.addEventListener("click", function () {

        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }

    });

    nextBtn.addEventListener("click", function () {

        if (currentIndex < images.length - 1) {
            showImage(currentIndex + 1);
        }

    });

    /* ---------------------------------------------------------
       KEYBOARD
    --------------------------------------------------------- */

    document.addEventListener("keydown", function (event) {

        if (!modal.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowLeft") {

            if (currentIndex > 0) {
                showImage(currentIndex - 1);
            }

        }

        if (event.key === "ArrowRight") {

            if (currentIndex < images.length - 1) {
                showImage(currentIndex + 1);
            }

        }

    });

    /* ---------------------------------------------------------
       STYLES
    --------------------------------------------------------- */

    const style = document.createElement("style");

    style.textContent = `

        /* ===============================
           15 AUGUST CARD
        =============================== */

        .aug15-project-card {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            isolation: isolate;
        }

        .aug15-cover {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            overflow: hidden;
            border-radius: inherit;
            background: #0b0d12;
        }

        .aug15-collage {
            width: 100%;
            height: 100%;

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            grid-template-rows:
                repeat(2, 1fr);

            gap: 3px;

            transform: scale(1.01);

            transition:
                transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .aug15-collage img {
            width: 100%;
            height: 100%;

            display: block;

            object-fit: cover;

            min-width: 0;
            min-height: 0;

            transition:
                transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .aug15-project-card:hover
        .aug15-collage {
            transform: scale(1.055);
        }

        .aug15-project-card:hover
        .aug15-collage img {
            transform: scale(1.025);
        }

        .aug15-overlay {
            position: absolute;

            left: 0;
            right: 0;
            bottom: 0;

            padding: 25px 22px 20px;

            background:
                linear-gradient(
                    to top,
                    rgba(0,0,0,.92),
                    rgba(0,0,0,.55),
                    transparent
                );

            color: white;
        }

        .aug15-category {
            display: block;

            margin-bottom: 5px;

            font-size: 10px;
            font-weight: 700;

            letter-spacing: .14em;

            opacity: .75;
        }

        .aug15-overlay h3 {
            margin: 0;

            font-size: 22px;
            line-height: 1.1;
        }

        .aug15-overlay p {
            margin: 6px 0 0;

            font-size: 13px;

            opacity: .72;
        }

        .aug15-arrow {
            position: absolute;

            right: 20px;
            bottom: 20px;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: rgba(255,255,255,.12);

            border: 1px solid
                rgba(255,255,255,.18);

            backdrop-filter: blur(10px);

            font-size: 20px;

            transition:
                transform .3s ease,
                background .3s ease;
        }

        .aug15-project-card:hover
        .aug15-arrow {
            transform: translate(3px,-3px);

            background:
                rgba(60,140,255,.8);
        }


        /* ===============================
           MODAL
        =============================== */

        #aug15-modal {
            position: fixed;

            inset: 0;

            z-index: 999999;

            display: flex;

            align-items: center;
            justify-content: center;

            padding: 25px;

            visibility: hidden;
            opacity: 0;

            transition:
                opacity .3s ease,
                visibility .3s ease;
        }

        #aug15-modal.active {
            visibility: visible;
            opacity: 1;
        }

        .aug15-modal-backdrop {
            position: absolute;

            inset: 0;

            background:
                rgba(0,0,0,.78);

            backdrop-filter:
                blur(18px);
        }

        .aug15-modal-box {
            position: relative;

            z-index: 2;

            width: min(1100px, 96vw);

            max-height: 92vh;

            overflow: hidden;

            border-radius: 24px;

            background:
                rgba(18,20,27,.96);

            border:
                1px solid
                rgba(255,255,255,.1);

            box-shadow:
                0 30px 100px
                rgba(0,0,0,.55);

            transform:
                translateY(25px)
                scale(.97);

            transition:
                transform .35s
                cubic-bezier(.2,.8,.2,1);
        }

        #aug15-modal.active
        .aug15-modal-box {
            transform:
                translateY(0)
                scale(1);
        }

        .aug15-close {
            position: absolute;

            top: 18px;
            right: 18px;

            z-index: 5;

            width: 42px;
            height: 42px;

            border: 1px solid
                rgba(255,255,255,.12);

            border-radius: 50%;

            background:
                rgba(255,255,255,.08);

            color: white;

            font-size: 28px;

            cursor: pointer;

            transition:
                background .25s ease,
                transform .25s ease;
        }

        .aug15-close:hover {
            background:
                rgba(255,255,255,.18);

            transform: rotate(90deg);
        }

        .aug15-modal-header {
            display: flex;

            align-items: center;
            justify-content: space-between;

            gap: 20px;

            padding: 25px 70px 20px 28px;

            color: white;
        }

        .aug15-modal-header span {
            font-size: 10px;

            letter-spacing: .15em;

            opacity: .55;
        }

        .aug15-modal-header h2 {
            margin: 4px 0;

            font-size: 28px;
        }

        .aug15-modal-header p {
            margin: 0;

            font-size: 13px;

            opacity: .6;
        }

        .aug15-counter {
            font-size: 14px;

            white-space: nowrap;

            opacity: .7;
        }

        .aug15-main-image-wrap {
            position: relative;

            height: min(58vh, 620px);

            display: flex;

            align-items: center;
            justify-content: center;

            background:
                rgba(0,0,0,.25);

            overflow: hidden;
        }

        #aug15-main-image {
            width: 100%;
            height: 100%;

            object-fit: contain;

            padding: 10px 80px;

            display: block;
        }

        .aug15-nav {
            position: absolute;

            top: 50%;

            transform:
                translateY(-50%);

            z-index: 4;

            width: 48px;
            height: 48px;

            border-radius: 50%;

            border: 1px solid
                rgba(255,255,255,.12);

            background:
                rgba(255,255,255,.09);

            color: white;

            font-size: 35px;

            line-height: 1;

            cursor: pointer;

            backdrop-filter: blur(10px);

            transition:
                .25s ease;
        }

        .aug15-nav:hover:not(:disabled) {
            background:
                rgba(60,140,255,.85);

            transform:
                translateY(-50%)
                scale(1.05);
        }

        .aug15-nav:disabled {
            opacity: .2;

            cursor: default;
        }

        .aug15-prev {
            left: 18px;
        }

        .aug15-next {
            right: 18px;
        }

        .aug15-thumbnails {
            display: flex;

            gap: 8px;

            padding: 14px 18px 18px;

            overflow-x: auto;

            scrollbar-width: thin;
        }

        .aug15-thumb {
            flex: 0 0 70px;

            height: 55px;

            padding: 0;

            overflow: hidden;

            border-radius: 9px;

            border:
                2px solid transparent;

            background: none;

            cursor: pointer;

            opacity: .55;

            transition:
                opacity .2s ease,
                transform .2s ease,
                border-color .2s ease;
        }

        .aug15-thumb img {
            width: 100%;
            height: 100%;

            display: block;

            object-fit: cover;
        }

        .aug15-thumb:hover {
            opacity: .85;

            transform: translateY(-2px);
        }

        .aug15-thumb.active {
            opacity: 1;

            border-color:
                #4c9cff;
        }

        body.aug15-modal-open {
            overflow: hidden;
        }


        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 700px) {

            #aug15-modal {
                padding: 10px;
            }

            .aug15-modal-box {
                width: 100%;

                border-radius: 18px;
            }

            .aug15-modal-header {
                padding: 20px 60px 15px 18px;
            }

            .aug15-modal-header h2 {
                font-size: 23px;
            }

            .aug15-main-image-wrap {
                height: 55vh;
            }

            #aug15-main-image {
                padding: 10px 48px;
            }

            .aug15-nav {
                width: 40px;
                height: 40px;

                font-size: 28px;
            }

            .aug15-prev {
                left: 8px;
            }

            .aug15-next {
                right: 8px;
            }

            .aug15-thumb {
                flex-basis: 58px;
                height: 48px;
            }

            .aug15-overlay {
                padding:
                    20px 15px 15px;
            }

            .aug15-overlay h3 {
                font-size: 18px;
            }

            .aug15-overlay p {
                font-size: 11px;
            }

        }

    `;

    document.head.appendChild(style);

    /* ---------------------------------------------------------
       IMAGE ERROR CHECK
    --------------------------------------------------------- */

    images.forEach(function (src) {

        const testImage = new Image();

        testImage.onerror = function () {
            console.warn(
                "15 August image not found:",
                src
            );
        };

        testImage.src = src;

    });

})();/* ==========================================
   ADD ARROW BUTTON TO ALL PROJECT CARDS
========================================== */

(function () {

    const cards = document.querySelectorAll(
        ".project-card, .portfolio-card, [data-project]"
    );

    cards.forEach((card) => {

        // Agar already arrow/button hai to dobara mat lagao
        if (
            card.querySelector(".universal-project-arrow") ||
            card.querySelector(".aug15-arrow")
        ) return;

        const arrow = document.createElement("span");

        arrow.className = "universal-project-arrow";
        arrow.innerHTML = "↗";

        arrow.setAttribute("aria-label", "View Project");

        card.style.position = "relative";

        card.appendChild(arrow);

    });

    // Button styling
    const style = document.createElement("style");

    style.textContent = `

        .universal-project-arrow {

            position: absolute;

            right: 20px;
            bottom: 20px;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background:
                linear-gradient(
                    135deg,
                    #4d9cff,
                    #1677ff
                );

            color: #fff;

            font-size: 20px;
            font-weight: 500;

            border: 1px solid
                rgba(255,255,255,.25);

            box-shadow:
                0 8px 25px
                rgba(30,120,255,.35);

            backdrop-filter: blur(10px);

            z-index: 20;

            pointer-events: none;

            transition:
                transform .35s
                cubic-bezier(.2,.8,.2,1),
                box-shadow .35s ease;

        }


        /* Hover animation */

        .project-card:hover
        .universal-project-arrow,
        .portfolio-card:hover
        .universal-project-arrow,
        [data-project]:hover
        .universal-project-arrow {

            transform:
                translate(3px,-3px)
                scale(1.06);

            box-shadow:
                0 12px 32px
                rgba(30,120,255,.55);

        }


        /* Shine effect */

        .universal-project-arrow::before {

            content: "";

            position: absolute;

            top: 0;
            left: -70%;

            width: 45%;
            height: 100%;

            background:
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(255,255,255,.55),
                    transparent
                );

            transform: skewX(-20deg);

            animation:
                projectArrowShine 3s
                ease-in-out infinite;

        }


        @keyframes projectArrowShine {

            0% {
                left: -70%;
            }

            45% {
                left: 130%;
            }

            100% {
                left: 130%;
            }

        }


        @media (max-width: 700px) {

            .universal-project-arrow {

                right: 14px;
                bottom: 14px;

                width: 36px;
                height: 36px;

                font-size: 18px;

            }

        }

    `;

    document.head.appendChild(style);

})();/* =====================================================
   15 AUGUST CARD — MATCH EXISTING PROJECT CARD STYLE
   Paste at END of script.js
===================================================== */

(function () {

    const style = document.createElement("style");

    style.textContent = `

        /* -----------------------------------------
           15 AUGUST CARD
        ----------------------------------------- */

        #aug15-project-card {
            position: relative !important;
            overflow: hidden !important;
            border-radius: 18px !important;
            background: #090e1c !important;
        }


        /* IMAGE AREA */

        #aug15-project-card .aug15-cover {
            position: relative !important;

            width: 100% !important;

            height: 350px !important;

            aspect-ratio: auto !important;

            overflow: hidden !important;

            border-radius: 0 !important;

            background: #080d18 !important;
        }


        /* COLLAGE */

        #aug15-project-card .aug15-collage {
            width: 100% !important;
            height: 100% !important;

            display: grid !important;

            grid-template-columns:
                repeat(3, 1fr) !important;

            grid-template-rows:
                repeat(2, 1fr) !important;

            gap: 2px !important;

            transform: none !important;
        }


        #aug15-project-card .aug15-collage img {
            width: 100% !important;
            height: 100% !important;

            object-fit: cover !important;

            display: block !important;

            transform: none !important;

            transition:
                transform .5s ease !important;
        }


        /* subtle image hover */

        #aug15-project-card:hover
        .aug15-collage img {
            transform: scale(1.025) !important;
        }


        /* -----------------------------------------
           DARK FOOTER — SAME AS OTHER CARDS
        ----------------------------------------- */

        #aug15-project-card .aug15-overlay {

            position: absolute !important;

            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;

            height: 78px !important;

            padding: 0 22px !important;

            display: flex !important;

            flex-direction: column !important;

            justify-content: center !important;

            background:
                #090e1c !important;

            color: white !important;

            border-top:
                1px solid
                rgba(255,255,255,.06) !important;

            box-sizing: border-box !important;

        }


        /* hide category */

        #aug15-project-card
        .aug15-category {
            display: none !important;
        }


        /* TITLE */

        #aug15-project-card
        .aug15-overlay h3 {

            margin: 0 !important;

            font-size: 18px !important;

            line-height: 1.25 !important;

            font-weight: 700 !important;

            color: #f5f7fb !important;

        }


        /* DESCRIPTION */

        #aug15-project-card
        .aug15-overlay p {

            display: none !important;

        }


        /* -----------------------------------------
           ARROW — SAME GREY STYLE AS OTHER CARDS
        ----------------------------------------- */

        #aug15-project-card
        .aug15-arrow {

            position: absolute !important;

            right: 20px !important;
            bottom: 19px !important;

            width: 40px !important;
            height: 40px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;

            border-radius: 50% !important;

            background:
                rgba(255,255,255,.12) !important;

            border:
                1px solid
                rgba(255,255,255,.16) !important;

            color: #fff !important;

            font-size: 20px !important;

            box-shadow:
                0 5px 18px
                rgba(0,0,0,.25) !important;

            backdrop-filter:
                blur(10px) !important;

            transform: none !important;

            transition:
                transform .3s ease,
                background .3s ease !important;

        }


        /* arrow hover */

        #aug15-project-card:hover
        .aug15-arrow {

            transform:
                translate(3px,-3px) !important;

            background:
                rgba(255,255,255,.20) !important;

        }


        /* remove old blue shine */

        #aug15-project-card
        .aug15-arrow::before {

            display: none !important;

        }


        /* -----------------------------------------
           CARD HOVER
        ----------------------------------------- */

        #aug15-project-card {

            transition:
                transform .35s ease,
                box-shadow .35s ease !important;

        }


        #aug15-project-card:hover {

            transform:
                translateY(-4px) !important;

            box-shadow:
                0 18px 45px
                rgba(0,0,0,.25) !important;

        }


        /* -----------------------------------------
           MOBILE
        ----------------------------------------- */

        @media (max-width: 700px) {

            #aug15-project-card
            .aug15-cover {

                height: 260px !important;

            }

            #aug15-project-card
            .aug15-overlay {

                height: 70px !important;

                padding:
                    0 16px !important;

            }

            #aug15-project-card
            .aug15-overlay h3 {

                font-size: 16px !important;

            }

            #aug15-project-card
            .aug15-arrow {

                right: 14px !important;
                bottom: 15px !important;

                width: 36px !important;
                height: 36px !important;

            }

        }

    `;

    document.head.appendChild(style);

})();/* =========================================
   VIEW MY WORK — FULL BORDER LIGHT LOOP
========================================= */

(() => {
  function createFullBorderAnimation() {
    const button = document.querySelector(
      ".hero .hero-actions .btn-primary"
    );

    if (!button || button.querySelector(".dfx-full-border-svg")) return;

    /* Previous half-circle animation disable */
    const style = document.createElement("style");

    style.textContent = `
      body .hero .hero-actions .btn-primary {
        position: relative !important;
        isolation: isolate !important;
        overflow: visible !important;
      }

      body .hero .hero-actions .btn-primary::before,
      body .hero .hero-actions .btn-primary::after {
        content: none !important;
        display: none !important;
        animation: none !important;
      }

      .dfx-full-border-svg {
        position: absolute !important;
        inset: -3px !important;
        z-index: 5 !important;

        width: calc(100% + 6px) !important;
        height: calc(100% + 6px) !important;

        overflow: visible !important;
        pointer-events: none !important;
      }

      .dfx-border-base {
        fill: none;
        stroke: rgba(147, 197, 253, 0.35);
        stroke-width: 1.5;
      }

      .dfx-border-glow {
        fill: none;
        stroke: rgba(59, 130, 246, 0.65);
        stroke-width: 7;
        stroke-linecap: round;

        stroke-dasharray: 20 80;
        stroke-dashoffset: 0;

        opacity: 0.55;
        filter: blur(5px);

        animation: dfxFullBorderLoop 2.6s linear infinite;
      }

      .dfx-border-beam {
        fill: none;
        stroke: #60a5fa;
        stroke-width: 3;
        stroke-linecap: round;

        stroke-dasharray: 18 82;
        stroke-dashoffset: 0;

        filter:
          drop-shadow(0 0 5px #3b82f6)
          drop-shadow(0 0 10px rgba(59,130,246,0.8));

        animation: dfxFullBorderLoop 2.6s linear infinite;
      }

      .dfx-border-head {
        fill: none;
        stroke: #ffffff;
        stroke-width: 4;
        stroke-linecap: round;

        stroke-dasharray: 2 98;
        stroke-dashoffset: 0;

        filter:
          drop-shadow(0 0 4px #ffffff)
          drop-shadow(0 0 9px #60a5fa);

        animation: dfxFullBorderLoop 2.6s linear infinite;
      }

      @keyframes dfxFullBorderLoop {
        from {
          stroke-dashoffset: 0;
        }

        to {
          stroke-dashoffset: -100;
        }
      }

      .hero .hero-actions .btn-primary:hover
      .dfx-border-glow {
        opacity: 0.9;
      }

      .hero .hero-actions .btn-primary:hover
      .dfx-border-beam,
      .hero .hero-actions .btn-primary:hover
      .dfx-border-head {
        animation-duration: 1.8s;
      }

      @media (prefers-reduced-motion: reduce) {
        .dfx-border-glow,
        .dfx-border-beam,
        .dfx-border-head {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    button.insertAdjacentHTML(
      "beforeend",
      `
        <svg
          class="dfx-full-border-svg"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <rect class="dfx-border-base" pathLength="100"></rect>
          <rect class="dfx-border-glow" pathLength="100"></rect>
          <rect class="dfx-border-beam" pathLength="100"></rect>
          <rect class="dfx-border-head" pathLength="100"></rect>
        </svg>
      `
    );

    const svg = button.querySelector(".dfx-full-border-svg");
    const rectangles = svg.querySelectorAll("rect");

    function updateBorderSize() {
      const width = button.offsetWidth + 6;
      const height = button.offsetHeight + 6;
      const borderRadius = (height - 4) / 2;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      rectangles.forEach((rectangle) => {
        rectangle.setAttribute("x", "2");
        rectangle.setAttribute("y", "2");
        rectangle.setAttribute("width", width - 4);
        rectangle.setAttribute("height", height - 4);
        rectangle.setAttribute("rx", borderRadius);
        rectangle.setAttribute("ry", borderRadius);
      });
    }

    updateBorderSize();

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateBorderSize);
      observer.observe(button);
    } else {
      window.addEventListener("resize", updateBorderSize);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createFullBorderAnimation
    );
  } else {
    createFullBorderAnimation();
  }
})();/* =========================================
   VIEW MY WORK — PERFECT OUTER BORDER LOOP
   Light will NEVER cross through the button
========================================= */

(() => {
  function installPerfectButtonBorder() {
    const button = document.querySelector(
      ".hero .hero-actions .btn-primary"
    );

    if (!button) return;

    /* Purana faulty SVG remove */
    button
      .querySelectorAll(
        ".dfx-full-border-svg, .dfx-perfect-border-svg"
      )
      .forEach((element) => element.remove());

    const style = document.createElement("style");
    style.id = "dfx-perfect-border-style";

    style.textContent = `
      body .hero .hero-actions .btn-primary {
        position: relative !important;
        isolation: isolate !important;
        overflow: visible !important;
      }

      /* Purana half-circle/shine effect completely off */

      body .hero .hero-actions .btn-primary::before,
      body .hero .hero-actions .btn-primary::after {
        content: none !important;
        display: none !important;
        opacity: 0 !important;
        animation: none !important;
        transform: none !important;
      }

      .dfx-perfect-border-svg {
        position: absolute !important;
        inset: -8px !important;
        z-index: 20 !important;

        width: calc(100% + 16px) !important;
        height: calc(100% + 16px) !important;

        overflow: visible !important;
        pointer-events: none !important;
      }

      .dfx-perfect-base {
        fill: none;
        stroke: rgba(147, 197, 253, 0.42);
        stroke-width: 1.5;
      }

      .dfx-perfect-glow {
        fill: none;
        stroke: rgba(59, 130, 246, 0.55);
        stroke-width: 9;
        stroke-linecap: round;

        stroke-dasharray: 15 85;
        stroke-dashoffset: 0;

        opacity: 0.5;
        filter: blur(5px);

        animation: dfxPerfectBorderMove 2.8s linear infinite;
      }

      .dfx-perfect-beam {
        fill: none;
        stroke: #60a5fa;
        stroke-width: 3;
        stroke-linecap: round;

        stroke-dasharray: 13 87;
        stroke-dashoffset: 0;

        filter:
          drop-shadow(0 0 4px #3b82f6)
          drop-shadow(0 0 9px rgba(59,130,246,0.85));

        animation: dfxPerfectBorderMove 2.8s linear infinite;
      }

      .dfx-perfect-head {
        fill: #ffffff;
        filter:
          drop-shadow(0 0 4px #ffffff)
          drop-shadow(0 0 9px #60a5fa);
      }

      .dfx-perfect-head-glow {
        fill: rgba(96, 165, 250, 0.48);
        filter: blur(4px);
      }

      @keyframes dfxPerfectBorderMove {
        from {
          stroke-dashoffset: 0;
        }

        to {
          stroke-dashoffset: -100;
        }
      }

      .hero .hero-actions .btn-primary:hover
      .dfx-perfect-glow {
        opacity: 0.85;
      }

      @media (prefers-reduced-motion: reduce) {
        .dfx-perfect-glow,
        .dfx-perfect-beam {
          animation: none !important;
        }

        .dfx-perfect-head,
        .dfx-perfect-head-glow {
          display: none !important;
        }
      }
    `;

    const oldStyle = document.getElementById(
      "dfx-perfect-border-style"
    );

    if (oldStyle) oldStyle.remove();

    document.head.appendChild(style);

    const uniqueId = `dfxMotionPath-${Date.now()}`;

    button.insertAdjacentHTML(
      "beforeend",
      `
        <svg
          class="dfx-perfect-border-svg"
          aria-hidden="true"
        >
          <path
            class="dfx-perfect-base"
            pathLength="100"
          ></path>

          <path
            class="dfx-perfect-glow"
            pathLength="100"
          ></path>

          <path
            class="dfx-perfect-beam"
            pathLength="100"
          ></path>

          <path
            id="${uniqueId}"
            class="dfx-perfect-motion-path"
            fill="none"
            stroke="none"
          ></path>

          <circle
            class="dfx-perfect-head-glow"
            r="9"
          >
            <animateMotion
              class="dfx-perfect-motion-glow"
              dur="2.8s"
              repeatCount="indefinite"
            ></animateMotion>
          </circle>

          <circle
            class="dfx-perfect-head"
            r="3.2"
          >
            <animateMotion
              class="dfx-perfect-motion-head"
              dur="2.8s"
              repeatCount="indefinite"
            ></animateMotion>
          </circle>
        </svg>
      `
    );

    const svg = button.querySelector(
      ".dfx-perfect-border-svg"
    );

    const basePath = svg.querySelector(
      ".dfx-perfect-base"
    );

    const glowPath = svg.querySelector(
      ".dfx-perfect-glow"
    );

    const beamPath = svg.querySelector(
      ".dfx-perfect-beam"
    );

    const motionPath = svg.querySelector(
      ".dfx-perfect-motion-path"
    );

    const motionGlow = svg.querySelector(
      ".dfx-perfect-motion-glow"
    );

    const motionHead = svg.querySelector(
      ".dfx-perfect-motion-head"
    );

    function updatePerfectPath() {
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;

      const padding = 8;
      const svgWidth = buttonWidth + padding * 2;
      const svgHeight = buttonHeight + padding * 2;

      const left = padding;
      const top = padding;
      const right = padding + buttonWidth;
      const bottom = padding + buttonHeight;

      const radius = buttonHeight / 2;
      const topCenter = top + radius;
      const bottomCenter = bottom - radius;

      /* Exact outer pill-shaped path */

      const pathData = `
        M ${left + radius} ${top}
        H ${right - radius}
        A ${radius} ${radius} 0 0 1 ${right} ${topCenter}
        V ${bottomCenter}
        A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}
        H ${left + radius}
        A ${radius} ${radius} 0 0 1 ${left} ${bottomCenter}
        V ${topCenter}
        A ${radius} ${radius} 0 0 1 ${left + radius} ${top}
        Z
      `;

      svg.setAttribute(
        "viewBox",
        `0 0 ${svgWidth} ${svgHeight}`
      );

      basePath.setAttribute("d", pathData);
      glowPath.setAttribute("d", pathData);
      beamPath.setAttribute("d", pathData);
      motionPath.setAttribute("d", pathData);

      motionGlow.setAttribute("path", pathData);
      motionHead.setAttribute("path", pathData);
    }

    updatePerfectPath();

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(
        updatePerfectPath
      );

      resizeObserver.observe(button);
    } else {
      window.addEventListener(
        "resize",
        updatePerfectPath
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      installPerfectButtonBorder
    );
  } else {
    installPerfectButtonBorder();
  }
})();/* ==========================================
   FINAL WORKING PROJECT IMAGE ZOOM
   Paste at END of script.js
========================================== */

(() => {
  function installFinalZoom() {
    if (document.getElementById("dfxFinalZoom")) return;

    const preview = document.querySelector(".project-modal-preview");
    const projectImage = document.querySelector(
      "[data-project-main-img]"
    );

    if (!preview || !projectImage) return;

    /* Zoom button automatically add hoga */

    let zoomButton = preview.querySelector(
      ".project-zoom-btn"
    );

    if (!zoomButton) {
      zoomButton = document.createElement("button");
      zoomButton.type = "button";
      zoomButton.className = "project-zoom-btn";
      zoomButton.innerHTML = "🔍 Zoom";
      zoomButton.setAttribute(
        "aria-label",
        "Zoom project image"
      );

      preview.appendChild(zoomButton);
    }

    /* CSS automatically add */

    const style = document.createElement("style");

    style.textContent = `
      /* Purane zoom viewers disable */

      #darshanZoom,
      #darshanZoomViewer,
      .project-zoom-overlay {
        display: none !important;
      }

      /* Zoom button */

      .project-modal-preview .project-zoom-btn {
        position: absolute !important;
        top: 14px !important;
        right: 14px !important;
        z-index: 100 !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;

        width: auto !important;
        min-width: 104px !important;
        height: 46px !important;
        padding: 0 18px !important;

        border: 1px solid rgba(255,255,255,0.22) !important;
        border-radius: 999px !important;

        background: rgba(10,20,38,0.78) !important;
        color: #ffffff !important;

        font-size: 14px !important;
        font-weight: 800 !important;

        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;

        box-shadow: 0 12px 30px rgba(0,0,0,0.28) !important;
        cursor: pointer !important;
      }

      /* Full-screen zoom */

      #dfxFinalZoom {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;

        display: none !important;
        align-items: center !important;
        justify-content: center !important;

        overflow: hidden !important;
        padding: 75px 20px 95px !important;

        background: rgba(2,6,16,0.94) !important;

        backdrop-filter: blur(18px) !important;
        -webkit-backdrop-filter: blur(18px) !important;

        touch-action: none !important;
      }

      #dfxFinalZoom.is-open {
        display: flex !important;
      }

      #dfxFinalZoomImage {
        display: block !important;

        width: auto !important;
        height: auto !important;

        max-width: 92vw !important;
        max-height: calc(100vh - 175px) !important;

        object-fit: contain !important;
        border-radius: 18px !important;

        box-shadow: 0 30px 100px rgba(0,0,0,0.7) !important;

        transform-origin: center !important;
        will-change: transform !important;

        cursor: grab !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }

      #dfxFinalZoomImage:active {
        cursor: grabbing !important;
      }

      .dfx-final-zoom-close {
        position: fixed !important;
        top: 18px !important;
        right: 18px !important;
        z-index: 10 !important;

        width: 50px !important;
        height: 50px !important;

        border: 1px solid rgba(255,255,255,0.22) !important;
        border-radius: 50% !important;

        background: rgba(20,30,50,0.76) !important;
        color: #ffffff !important;

        font-size: 30px !important;
        cursor: pointer !important;
      }

      .dfx-final-zoom-tools {
        position: fixed !important;
        left: 50% !important;
        bottom: 20px !important;
        z-index: 10 !important;

        display: flex !important;
        align-items: center !important;
        gap: 8px !important;

        padding: 8px !important;
        border: 1px solid rgba(255,255,255,0.18) !important;
        border-radius: 999px !important;

        background: rgba(10,18,34,0.78) !important;
        backdrop-filter: blur(18px) !important;

        transform: translateX(-50%) !important;
      }

      .dfx-final-zoom-tools button {
        min-width: 46px !important;
        height: 44px !important;
        padding: 0 14px !important;

        border: 1px solid rgba(255,255,255,0.18) !important;
        border-radius: 999px !important;

        background: rgba(255,255,255,0.1) !important;
        color: #ffffff !important;

        font-size: 18px !important;
        font-weight: 800 !important;
        cursor: pointer !important;
      }

      .dfx-final-zoom-level {
        min-width: 64px !important;
        color: #ffffff !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        text-align: center !important;
      }

      @media (max-width: 600px) {
        #dfxFinalZoom {
          padding: 70px 10px 90px !important;
        }

        #dfxFinalZoomImage {
          max-width: 95vw !important;
          max-height: calc(100vh - 160px) !important;
          border-radius: 14px !important;
        }

        .project-modal-preview .project-zoom-btn {
          top: 10px !important;
          right: 10px !important;
          min-width: 92px !important;
          height: 42px !important;
          padding: 0 14px !important;
        }
      }
    `;

    document.head.appendChild(style);

    /* Zoom viewer HTML automatically add */

    const viewer = document.createElement("div");
    viewer.id = "dfxFinalZoom";
    viewer.setAttribute("aria-hidden", "true");

    viewer.innerHTML = `
      <button
        class="dfx-final-zoom-close"
        type="button"
        aria-label="Close zoom"
      >×</button>

      <img
        id="dfxFinalZoomImage"
        alt="Zoomed project image"
      >

      <div class="dfx-final-zoom-tools">
        <button type="button" data-dfx-zoom="out">−</button>

        <span class="dfx-final-zoom-level">
          100%
        </span>

        <button type="button" data-dfx-zoom="in">+</button>

        <button type="button" data-dfx-zoom="reset">
          Reset
        </button>
      </div>
    `;

    document.body.appendChild(viewer);

    const zoomImage = viewer.querySelector(
      "#dfxFinalZoomImage"
    );

    const zoomLevel = viewer.querySelector(
      ".dfx-final-zoom-level"
    );

    const closeButton = viewer.querySelector(
      ".dfx-final-zoom-close"
    );

    let scale = 1;
    let moveX = 0;
    let moveY = 0;

    let dragging = false;
    let startX = 0;
    let startY = 0;

    function updateZoom() {
      if (scale <= 1) {
        moveX = 0;
        moveY = 0;
      }

      zoomImage.style.transform =
        `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;

      zoomLevel.textContent =
        `${Math.round(scale * 100)}%`;
    }

    function changeZoom(amount) {
      scale = Math.min(
        6,
        Math.max(1, scale + amount)
      );

      updateZoom();
    }

    function resetZoom() {
      scale = 1;
      moveX = 0;
      moveY = 0;

      updateZoom();
    }

    function openZoom() {
      const sourceImage = document.querySelector(
        ".project-modal.is-open [data-project-main-img]"
      ) || projectImage;

      const source =
        sourceImage.currentSrc || sourceImage.src;

      if (!source) return;

      zoomImage.src = source;
      zoomImage.alt =
        sourceImage.alt || "Zoomed project image";

      resetZoom();

      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
    }

    function closeZoom() {
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");

      zoomImage.removeAttribute("src");
      document.body.style.overflow = "";

      dragging = false;
      resetZoom();
    }

    /* Zoom button click */

    document.addEventListener(
      "click",
      (event) => {
        const clickedButton = event.target.closest(
          ".project-zoom-btn"
        );

        if (!clickedButton) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        openZoom();
      },
      true
    );

    /* Zoom controls */

    viewer.addEventListener("click", (event) => {
      const control = event.target.closest(
        "[data-dfx-zoom]"
      );

      if (control) {
        const action = control.dataset.dfxZoom;

        if (action === "in") changeZoom(0.25);
        if (action === "out") changeZoom(-0.25);
        if (action === "reset") resetZoom();

        return;
      }

      if (event.target === viewer) {
        closeZoom();
      }
    });

    closeButton.addEventListener(
      "click",
      closeZoom
    );

    /* Mouse-wheel zoom */

    viewer.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        changeZoom(
          event.deltaY < 0 ? 0.25 : -0.25
        );
      },
      { passive: false }
    );

    /* Drag zoomed image */

    zoomImage.addEventListener(
      "pointerdown",
      (event) => {
        if (scale <= 1) return;

        dragging = true;

        startX = event.clientX - moveX;
        startY = event.clientY - moveY;

        zoomImage.setPointerCapture?.(
          event.pointerId
        );
      }
    );

    zoomImage.addEventListener(
      "pointermove",
      (event) => {
        if (!dragging) return;

        moveX = event.clientX - startX;
        moveY = event.clientY - startY;

        updateZoom();
      }
    );

    zoomImage.addEventListener(
      "pointerup",
      () => {
        dragging = false;
      }
    );

    zoomImage.addEventListener(
      "pointercancel",
      () => {
        dragging = false;
      }
    );

    /* Double-click zoom */

    zoomImage.addEventListener(
      "dblclick",
      () => {
        scale = scale > 1 ? 1 : 2.5;
        updateZoom();
      }
    );

    /* Keyboard */

    document.addEventListener(
      "keydown",
      (event) => {
        if (!viewer.classList.contains("is-open")) {
          return;
        }

        if (event.key === "Escape") closeZoom();

        if (
          event.key === "+" ||
          event.key === "="
        ) {
          changeZoom(0.25);
        }

        if (event.key === "-") {
          changeZoom(-0.25);
        }

        if (event.key === "0") {
          resetZoom();
        }
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      installFinalZoom
    );
  } else {
    installFinalZoom();
  }
})();