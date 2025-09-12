function loadbase(){
      const base = document.createElement('base');
      base.href = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
        ? '/'
        : 'https://www.ryanstudio.dev/'; // absolute URL with protocol and trailing slash
      document.head.appendChild(base);
    }
loadbase();