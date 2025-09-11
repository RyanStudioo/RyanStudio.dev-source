function parseCookies(cookieString) {
    return cookieString
        .split('; ')
        .map(cookie => cookie.split('='))
        .reduce((acc, [key, value]) => {
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
}

export function setTheme(darkmode=true) {
    const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
    document.cookie = `darkmode=${darkmode}; expires=${expires}; path=/`;
}

export function getTheme() {
    let cookies = parseCookies(document.cookie);
    // Return true only if the cookie exists and is exactly 'true'
    return cookies.darkmode === 'true';
}

window.getTheme = getTheme;
window.setTheme = setTheme;
