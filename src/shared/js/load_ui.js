function loadUI(){
    fetch('src/shared/html/nav-bar.html')
    .then(response => response.text())
    .then(data => {
    var navbar = document.getElementById("nav-bar").innerHTML = data;})
}

function toggleTheme(){
    document.body.classList.toggle("dark-mode");
}