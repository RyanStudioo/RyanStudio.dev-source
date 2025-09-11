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

window.loadUI = loadUI;
window.toggleTheme = toggleTheme;
loadUI(true);
