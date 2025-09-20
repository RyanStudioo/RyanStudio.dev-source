import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.js";

let fuse;
let itemsArray;

export async function fetchAll() {
  const res = await fetch("/src/pages.json");
  const json = await res.json();
  const searchResults = getSearchHistory()
  itemsArray = [];
  for (const [key, value] of Object.entries(json)) {
    itemsArray = itemsArray.concat(value)
  }
  for (const itemID of searchResults.reverse()) {
    itemsArray.unshift(getSearchByID(itemID))
  }
  itemsArray = new Set(itemsArray)
  itemsArray = [...itemsArray]
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
  var finalList = []
    const fuseResults = fuse.search(searchQuery).map(r => r.item);
    var results = finalList.concat(fuseResults)
    results = new Set(results)
    const final = [...results]
    return final
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId); // cancel previous timer
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
export function formatSearch(result) {
  let history = getSearchHistory()
  let className;
  if (!history.includes(result.id)){
    className = "search-icon"
  } else {
    className = "history-icon"
  }
   return `
        <a href="${result.href}" id="${result.id}" class="${className}">
          <div>
            <h1>${result.title}</h1>
            <p>${result.description}</p>
          </div>
        </a>`
}

export function getSearchHistory() {
  const storedSearchHistoryString = localStorage.getItem("searchHistory")
  if (!storedSearchHistoryString) {return []}
  const storedSearchHistory = storedSearchHistoryString.split(",")
  return storedSearchHistory
}

export function storeSearchHistoryEntry(entryID) {
  var searchHistory = getSearchHistory()
  console.log(entryID)
  console.log(searchHistory)

  if (!searchHistory) {
    localStorage.setItem("searchHistory", [entryID].toString())
    return [entryID]
  }

  searchHistory.unshift(entryID);
  if (searchHistory.includes(entryID)) {
    searchHistory = new Set(searchHistory)
    searchHistory = [...searchHistory]
  }
  if (searchHistory.length > 3) {
    searchHistory.pop()
  }
  localStorage.setItem("searchHistory", searchHistory.toString())
  return searchHistory
}

export async function addListeners() {
  const searchBarResults = document.getElementById("search-results")
  for (const child of searchBarResults.children) {
    child.addEventListener("click", ()=> {
      const id = child.id
      storeSearchHistoryEntry(id)
    }, {once: true})
  }
}


function getSearchByID(id) {
  return itemsArray.find(item => item.id === id)
}