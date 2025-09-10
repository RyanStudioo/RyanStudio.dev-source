function loadUI(transparent=false) {
    fetch('src/shared/html/nav-bar.html')
    .then(response => response.text())
    .then(data => {
    var navbar = document.getElementById("nav-bar")
    navbar.innerHTML = data;
    if (transparent) {
        navbar.classList.add("transparent");
    }
    })
    .then(() => {
        document.body.style.animation = "fadeIn 1s forwards";
        
    })
}

function toggleTheme(){
    document.body.classList.toggle("dark-mode");
}