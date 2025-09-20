import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.js";

let fuse;

async function fetchAll() {
  const res = await fetch("/src/pages.json");
  const json = await res.json();
  var itemsArray = [];
  for (const [key, value] of Object.entries(json)) {
    itemsArray = itemsArray.concat(value)
  }
  return itemsArray
}

export async function initSearch() {
  const itemsArray = await fetchAll()

  fuse = new Fuse(itemsArray, {
    keys: ["title", "description", "tags"],
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