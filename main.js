// Apply saved theme immediately to prevent flash
(function() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

// Re-run initializers when nav.html loads
function initNavigationFeatures() {
  initThemeToggle();
  initMobileMenu();

  if (window.feather) {
    feather.replace();
  }
}

// Load nav.html dynamically
document.addEventListener("DOMContentLoaded", () => {
  fetch("nav.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("nav-placeholder").innerHTML = data;
      initNavigationFeatures(); // Re-run JS after nav is inserted
    });

  initContactForm(); // This can run anytime
});

// THEME TOGGLE
function initThemeToggle() {
  const html = document.documentElement;
  const desktopBtn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-theme-toggle');

  if (!desktopBtn && !mobileBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  savedTheme === 'dark'
    ? html.classList.add('dark')
    : html.classList.remove('dark');

  updateIcons();

  function toggleTheme() {
    html.classList.toggle('dark');
    const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateIcons();
  }

  if (desktopBtn) desktopBtn.addEventListener('click', toggleTheme);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);

  function updateIcons() {
    const isDark = html.classList.contains('dark');
    const icons = [desktopBtn, mobileBtn]
      .filter(Boolean)
      .map(btn => btn.querySelector("i"));

    icons.forEach(icon => {
      if (icon) icon.setAttribute("data-feather", isDark ? "sun" : "moon");
    });

    setTimeout(() => feather.replace(), 10);
  }
}

// MOBILE MENU
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle("translate-x-full");
  });

  // Close when clicking a link
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("translate-x-full");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const open = !menu.classList.contains("translate-x-full");
    const inside = menu.contains(e.target);
    const buttonClicked = btn.contains(e.target);
    if (open && !inside && !buttonClicked) {
      menu.classList.add("translate-x-full");
    }
  });
}

// CONTACT FORM
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;

    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        if (status) status.classList.remove("hidden");
        form.reset();
        setTimeout(() => status?.classList.add("hidden"), 4000);
      } else {
        alert("Oops! There was a problem submitting your form");
      }
    } catch (err) {
      alert("Oops! There was a problem submitting your form");
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  });
}