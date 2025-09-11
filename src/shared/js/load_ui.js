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
    fetch('src/shared/html/nav-bar.html')
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
    console.log(localStorage.getItem("darkmode"));
}

function waitForLoadUI(transparent=true) {
        if (window.loadUI) {
            window.loadUI(transparent);
        } else {
            setTimeout(waitForLoadUI, 50); // Try again in 50ms
        }
    }

window.loadUI = loadUI;
window.toggleTheme = toggleTheme;
window.waitForLoadUI = waitForLoadUI;
