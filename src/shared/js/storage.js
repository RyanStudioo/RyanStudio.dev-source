export function setTheme(darkmode = true) {
    localStorage.setItem('darkmode', darkmode ? 'true' : 'false');

}

export function getTheme() {
    return localStorage.getItem('darkmode') === 'true' | localStorage.getItem('darkmode') === null;
}

export function

window.getTheme = getTheme;
window.setTheme = setTheme;
