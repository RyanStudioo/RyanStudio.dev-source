import {getTheme, setTheme} from './cookies.js';

function applySavedTheme() {
    if (!getTheme()) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

applySavedTheme();

export function loadUI(transparent=true) {
    fetch('/src/shared/html/nav-bar.html')
    .then(response => response.text())
    .then(data => {
    var navbar = document.getElementById("nav-bar")
    navbar.innerHTML = data;
    if (transparent) {
        navbar.classList.add("transparent");
    }
    const themeCheckbox = document.getElementById("theme-checkbox");
    if (themeCheckbox) {
            themeCheckbox.checked = !getTheme();
        }
    })
    .then(() => {
        document.body.style.animation = "fadeIn 1s forwards";
        
    })
    .then(() => hamburger())
}

function hamburger() {
    const navBar = document.getElementById('navBar') || document.querySelector('.nav-bar');
      const btn = document.getElementById('hamburger');
      const dropdown = document.getElementById('menuDropdown');
      const wrapper = document.querySelector('.hamburger-wrapper');

      if (!navBar || !btn || !dropdown || !wrapper) {
        // Elements not present (maybe on large-screen where nav-injection differs) — fail silently
        return;
      }

      let focusableItems = Array.from(dropdown.querySelectorAll('[role="menuitem"]'));

      function openMenu() {
        navBar.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('aria-hidden', 'false');
        focusableItems.forEach(el => el.tabIndex = 0);
        focusableItems[0]?.focus();
      }

      function closeMenu() {
        navBar.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');
        focusableItems.forEach(el => el.tabIndex = -1);
        btn.focus();
      }

      // Make sure items are not tabbable until open
      focusableItems.forEach(el => el.tabIndex = -1);

      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenu(); else openMenu();
      });

      // ESC closes
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          if (expanded) closeMenu();
        }
      });

      // Click outside closes — guard in case wrapper is absent
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          if (expanded) closeMenu();
        }
      });

      // Clicking a menu item closes the menu
      dropdown.addEventListener('click', (e) => {
        if (e.target.closest('[role="menuitem"]')) closeMenu();
      });

      // Close the mobile menu if the user resizes to desktop so layout stays consistent
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
          if (navBar.classList.contains('open')) closeMenu();
        }
      });
}

function toggleTheme(){
    const themeCheckbox = document.getElementById("theme-checkbox");
    const isDark = themeCheckbox.checked
    if (!isDark) {
        document.body.classList.remove("dark-mode");
        setTheme(true);
        console.log("Dark mode enabled");
    } else {
        document.body.classList.add("dark-mode");
        setTheme(false);
        console.log("Light mode enabled");
    }
}

window.loadUI = loadUI;
window.toggleTheme = toggleTheme;
