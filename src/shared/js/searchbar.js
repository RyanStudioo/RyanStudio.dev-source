import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.js";

let fuse;

export async function initSearch() {
  const res = await fetch("/projects/articles.json");
  const json = await res.json();

  const itemsArray = Array.isArray(json) ? json : Object.values(json);

  fuse = new Fuse(itemsArray, {
    keys: ["title", "description"],
    threshold: 0.4,
  });
}

export function searchResults(searchQuery) {
    const results = fuse.search(searchQuery).map(r => r.item);
    return results
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId); // cancel previous timer
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}