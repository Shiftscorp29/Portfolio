// Initialize EmailJS
(function () {
  emailjs.init("G4SIThlBx6JmKNEft");
})();

// DOM elements
const themeToggle = document.getElementById("theme-toggle");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");

// Navigation elements
const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
const heroButtons = document.querySelectorAll("[data-section]");

// State management
let isMenuOpen = false;
let activeSection = "home";
let isSubmitting = false;

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const theme = savedTheme || systemTheme;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");

  if (isDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

// Mobile menu management
function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu.classList.remove("hidden");
    document.querySelector(".menu-icon").classList.add("hidden");
    document.querySelector(".close-icon").classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
    document.querySelector(".menu-icon").classList.remove("hidden");
    document.querySelector(".close-icon").classList.add("hidden");
  }
}

function closeMobileMenu() {
  if (isMenuOpen) {
    isMenuOpen = false;
    mobileMenu.classList.add("hidden");
    document.querySelector(".menu-icon").classList.remove("hidden");
    document.querySelector(".close-icon").classList.add("hidden");
  }
}

// Navigation functionality
function updateActiveNavItem(sectionId) {
  navItems.forEach((item) => {
    if (item.dataset.section === sectionId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  activeSection = sectionId;
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed nav
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
  closeMobileMenu();
}

// Scroll spy functionality
function handleScroll() {
  const sections = ["home", "about", "projects", "contact"];
  let currentSection = "home";

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = sectionId;
        break;
      }
    }
  }

  if (currentSection !== activeSection) {
    updateActiveNavItem(currentSection);
  }
}

// Toast notification system
function showToast(title, description, type = "success") {
  const toastTitle = toast.querySelector(".toast-title");
  const toastDescription = toast.querySelector(".toast-description");

  toastTitle.textContent = title;
  toastDescription.textContent = description;

  // Remove previous type classes
  toast.classList.remove("success", "error");
  toast.classList.add(type);

  // Show toast
  toast.classList.remove("hidden");

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  toast.classList.add("hidden");
}

// Contact form handling
async function handleFormSubmit(e) {
  e.preventDefault();

  if (isSubmitting) return;

  isSubmitting = true;

  // Update button state
  const submitButton = contactForm.querySelector(".form-submit");
  const submitText = submitButton.querySelector(".submit-text");
  const submitLoading = submitButton.querySelector(".submit-loading");

  submitText.classList.add("hidden");
  submitLoading.classList.remove("hidden");
  submitButton.disabled = true;

  const formData = new FormData(contactForm);

  const templateParams = {
    from_name: formData.get("name"),
    from_email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    await emailjs.send("service_wf5xxvy", "template_486ssub", templateParams);

    showToast(
      "Message Sent!",
      "Thank you for reaching out. I'll get back to you soon!",
      "success",
    );

    contactForm.reset();
  } catch (error) {
    console.error("EmailJS error:", error);
    showToast(
      "Error",
      "Failed to send message. Please try again or contact me directly.",
      "error",
    );
  } finally {
    isSubmitting = false;

    // Reset button state
    submitText.classList.remove("hidden");
    submitLoading.classList.add("hidden");
    submitButton.disabled = false;
  }
}

// Animation on scroll
function animateOnScroll() {
  const animatedElements = document.querySelectorAll(".animate-fade-in");

  animatedElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

// Smooth scroll for anchor links
function handleAnchorClick(e) {
  const href = e.target.getAttribute("href");
  if (href && href.startsWith("#")) {
    e.preventDefault();
    const targetId = href.substring(1);
    scrollToSection(targetId);
  }
}

// Initialize Lucide icons
function initializeIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Event listeners
function addEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", toggleTheme);
  }

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Navigation items
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const sectionId = e.target.dataset.section;
      if (sectionId) {
        scrollToSection(sectionId);
      }
    });
  });

  // Hero buttons and other section buttons
  heroButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const sectionId =
        e.target.dataset.section ||
        e.target.closest("[data-section]")?.dataset.section;
      if (sectionId) {
        scrollToSection(sectionId);
      }
    });
  });

  // Contact form
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Toast close button
  const toastClose = toast.querySelector(".toast-close");
  if (toastClose) {
    toastClose.addEventListener("click", hideToast);
  }

  // Scroll events
  window.addEventListener("scroll", () => {
    handleScroll();
    animateOnScroll();
  });

  // Resize events
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Click outside mobile menu to close
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Anchor link handling
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      handleAnchorClick(e);
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMobileMenu();
    }

    if (e.key === "Escape" && !toast.classList.contains("hidden")) {
      hideToast();
    }
  });
}

// Initialize fade-in animations
function initializeAnimations() {
  const animatedElements = document.querySelectorAll(".animate-fade-in");
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeIcons();
  initializeAnimations();
  addEventListeners();

  // Initial animation trigger
  setTimeout(animateOnScroll, 100);

  // Set initial active nav item
  updateActiveNavItem("home");
});

// Handle system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  });

// Intersection Observer for better scroll spy (alternative implementation)
if ("IntersectionObserver" in window) {
  const observerOptions = {
    root: null,
    rootMargin: "-80px 0px -80px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        if (sectionId && sectionId !== activeSection) {
          updateActiveNavItem(sectionId);
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
  });
}
// Utility functions for external use
window.portfolioUtils = {
  scrollToSection,
  showToast,
  hideToast,
  toggleTheme,
};
