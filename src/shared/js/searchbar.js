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
  return itemsArray
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

function isApexDomain(url) {
  return url === "ryanstudio.dev" || url === "www.ryanstudio.dev"
}

export function formatSearch(result) {
  let history = getSearchHistory()
  let className;
  if (!history.includes(result.id)){
    className = "search-icon"
  } else {
    className = "history-icon"
  }
  try {
    const urlHref = new URL(result.href)
    const internalLink = isApexDomain(urlHref)
    if (!internalLink) {
      className = className + " external-link"
    }
  } finally {
   return `
        <a href="${result.href}" id="${result.id}" class="${className}">
          <div>
            <h1>${result.title}</h1>
            <p>${result.description}</p>
          </div>
        </a>`
  }
}

export function getSearchHistory() {
  const storedSearchHistoryString = localStorage.getItem("searchHistory")
  if (!storedSearchHistoryString) {return []}
  const storedSearchHistory = storedSearchHistoryString.split(",")
  return storedSearchHistory
}

export function storeSearchHistoryEntry(entryID) {
  if (!entryID) { return}
  var searchHistory = getSearchHistory()

  if (!searchHistory) {
    localStorage.setItem("searchHistory", [entryID].toString())
    return [entryID]
  }

  searchHistory.unshift(entryID);
  if (searchHistory.includes(entryID)) {
    searchHistory = new Set(searchHistory)
    searchHistory = [...searchHistory]
  }
  if (searchHistory.length > 5) {
    searchHistory.pop()
  }
  localStorage.setItem("searchHistory", searchHistory.toString())
  return searchHistory
}

export async function addListeners(id="search-results") {
  const searchBarResults = document.getElementById(id)
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

export async function searchPage(query=null, threshold=false, fill=true) {
  var final;
  var searchHistoryResults = [];
  var remaining = []
  var searchResults = []

  const searchHistory = getSearchHistory()
  searchHistoryResults = searchHistory.map(result => getSearchByID(result))
  final = searchHistoryResults
  if (threshold && query) {
    const customfuse = new Fuse(itemsArray, {
    keys: ["title", "description", "tags"],
    threshold: threshold
  });
    searchResults = customfuse.search(query).map(item=>item.item)
    console.log(searchResults)
  }
  if (fill) {
    remaining = remaining.concat(itemsArray)
  }
  final = searchResults.concat(searchHistoryResults)
  final = final.concat(remaining)
  final = new Set(final)
  final = [...final]
  return {"resultsAmount": searchResults.length, "results": final}

}