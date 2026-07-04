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
//     window.location.href = `mailto:editionlord01@gmail.com?subject=${subject}&body=${body}`;
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
      "assets/images/projects/event-launch/1.png",
      "assets/images/projects/event-launch/2.png",
      "assets/images/projects/event-launch/3.png",
      "assets/images/projects/event-launch/4.png",
      "assets/images/projects/event-launch/5.png",
      "assets/images/projects/event-launch/6.png",
      "assets/images/projects/event-launch/7.png"
    ]
  },

  "youtube-thumbnail": {
    title: "Creator Video Thumbnail",
    category: "Thumbnails",
    description: "Thumbnail design variations focused on contrast, clarity, and scroll-stopping visual impact.",
    images: [
      "assets/images/projects/youtube-thumbnail/1.png",
      "assets/images/projects/youtube-thumbnail/2.png",
      "assets/images/projects/youtube-thumbnail/3.png"
    ]
  },

  "branding": {
    title: "Business Brand Graphics",
    category: "Branding",
    description: "Branding graphics, mockups, identity previews, and professional visual presentation.",
    images: [
      "assets/images/projects/branding/1.png",
      "assets/images/projects/branding/2.png",
      "assets/images/projects/branding/3.png"
    ]
  },

  "social-media": {
    title: "Promotion Creative Set",
    category: "Social Media",
    description: "A set of social media creatives designed for promotional campaigns and brand communication.",
    images: [
      "assets/images/projects/social-media/1.png",
      "assets/images/projects/social-media/2.png",
      "assets/images/projects/social-media/3.png"
    ]
  },

  "mockup": {
    title: "Premium Mockup Presentation",
    category: "Mockups",
    description: "Mockup presentation images showing how the final design looks in realistic placements.",
    images: [
      "assets/images/projects/mockup/1.png",
      "assets/images/projects/mockup/2.png",
      "assets/images/projects/mockup/3.png"
    ]
  },

  "political-poster": {
    title: "Public Campaign Poster",
    category: "Posters",
    description: "Political and public campaign poster visuals with clear message hierarchy.",
    images: [
      "assets/images/projects/political-poster/1.png",
      "assets/images/projects/political-poster/2.png",
      "assets/images/projects/political-poster/3.png"
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

function showProjectPrev() {
  if (!activeProject) return;
  activeProjectIndex =
    (activeProjectIndex - 1 + activeProject.images.length) % activeProject.images.length;
  renderProjectImage();
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