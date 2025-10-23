export function setTheme(darkmode = true) {
    localStorage.setItem('darkmode', darkmode ? 'true' : 'false');

}

export function getTheme() {
    return localStorage.getItem('darkmode') === 'true' | localStorage.getItem('darkmode') === null;
}

export function readPageDetails(category) {
    const pageDetails = JSON.parse(sessionStorage.getItem('pageDetails'));
    if (!pageDetails) {return null;}
    if (!category in pageDetails) {return null;}
    return pageDetails[category];
}



window.getTheme = getTheme;
window.setTheme = setTheme;
