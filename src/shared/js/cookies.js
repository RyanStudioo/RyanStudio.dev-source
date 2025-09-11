function parseCookies(cookieString) {
    return cookieString
        .split('; ')
        .map(cookie => cookie.split('='))
        .reduce((acc, [key, value]) => {
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
}

export function setTheme(darkmode = true) {
    localStorage.setItem('darkmode', darkmode ? 'true' : 'false');

}

export function getTheme() {
    return localStorage.getItem('darkmode') === 'true' | localStorage.getItem('darkmode') === null;
}

window.getTheme = getTheme;
window.setTheme = setTheme;
