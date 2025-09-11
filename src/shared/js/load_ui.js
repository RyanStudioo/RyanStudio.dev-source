import {getTheme, setTheme} from './cookies.js';

function loadUI(transparent=false) {
    fetch('src/shared/html/nav-bar.html')
    .then(response => response.text())
    .then(data => {
    var navbar = document.getElementById("nav-bar")
    navbar.innerHTML = data;
    if (transparent) {
        navbar.classList.add("transparent");
    }
    if (!getTheme()) {
        document.getElementById("theme-checkbox").checked = true;
        toggleTheme();
    }
    })
    .then(() => {
        document.body.style.animation = "fadeIn 1s forwards";
        
    })
}

function toggleTheme(){
    if (document.body.classList.contains("dark-mode")) {
        setTheme(true);
        console.log("Dark mode enabled");
    } else {
        setTheme(false);
        console.log("Light mode enabled");
    }
    document.body.classList.toggle("dark-mode");
}

function waitForLoadUI() {
        if (window.loadUI) {
            window.loadUI(true);
        } else {
            setTimeout(waitForLoadUI, 50); // Try again in 50ms
        }
    }

window.loadUI = loadUI;
window.toggleTheme = toggleTheme;
window.waitForLoadUI = waitForLoadUI;
