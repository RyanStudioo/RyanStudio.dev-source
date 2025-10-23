
function advancedBaseUrl(path){
    const base = document.createElement('base');
    base.href = (location.hostname === `localhost${path}` || location.hostname === `127.0.0.1${path}`)
        ? '/'
        : `https://www.ryanstudio.dev${path}`; // absolute URL with protocol and trailing slash
    document.head.appendChild(base);
}