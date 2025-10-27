
function createAsideElement(projectID, doc) {
    const parent = document.createElement("li");
    parent.id = doc.name.replace(/\s+/g, '-').toLowerCase();
    const title = document.createElement("a");
    parent.appendChild(title);
    title.textContent = doc.name;
    title.classList.add("category-title");
    if ("children" in doc) {
        parent.classList.add("aside-category");
        const subpages = document.createElement("ul");
        parent.appendChild(subpages);
        subpages.classList.add("page-container");

        title.addEventListener("click", (event) => {
            event.preventDefault();
            parent.classList.toggle("open");
            writeAsideBar(projectID, parent.id)
        });

        for (const subpage of doc.children) {
            subpages.appendChild(createAsideElement(projectID, subpage))
        }
    } else {
        title.href = doc.href;
        parent.classList.add("page-title");
    }
    return parent
}

export async function loadAside(projectID) {
    const projects_links = await fetch("/docs/_docpages.json");
    const projects_path = await projects_links.json();
    const project_fetch = await fetch(projects_path[projectID].path);
    const project = await project_fetch.json();
    const name = project.name;
    const aside = project.aside;
    document.getElementById("aside-title").textContent = name
    const asideContainer = document.getElementById("aside-container");
    for (const doc of aside) {
        asideContainer.appendChild(createAsideElement(projectID, doc))
    }
    await openAsideBar(projectID);

}
    
function iterateAside(flatPages, project) {
    if ("children" in project) {
            for (const page of project.children) {
                iterateAside(flatPages, page)
            }
        } else {
            flatPages.push(project)
        }
    return flatPages
}

async function flattenPages(projectID) {
    let pages = await fetch("/docs/_docpages.json");
    pages = await pages.json();
    let project_page = await fetch(pages[projectID].path);
    project_page = await project_page.json();
    const aside = project_page.aside;
    let flatPages = [];
    for (const project of aside) {
        flatPages = iterateAside(flatPages, project)
    }
    return flatPages;
}

async function getNextPagePointer(projectID) {
    const currentPage = window.location.pathname
    let flatPages = await flattenPages(projectID);
    flatPages = flatPages.map(page => page.href)
    const page = flatPages.indexOf(currentPage);
    if (page < flatPages.length - 1) {
        return flatPages[page + 1]
    } else {
        return null
    }
}

export async function loadNextPagePointer(projectID) {
    const nextPage = await getNextPagePointer(projectID);
    if (!nextPage) { return}
    const section = document.createElement("section");
    const nextPagePointer = document.createElement("a");
    section.appendChild(nextPagePointer);
    nextPagePointer.classList.add("next-page");
    nextPagePointer.href = nextPage;
    nextPagePointer.textContent = "Next Page >";
    document.querySelector(".main-article").appendChild(section);
}

async function setPageTitle(projectID) {
    const pages = await flattenPages(projectID);
    const windowLocation = window.location.pathname
    const page = pages.find(page => page.href === windowLocation)

    let response = await fetch("/docs/_docpages.json");
    response = await response.json();
    let project_page = await fetch(response[projectID].path);
    project_page = await project_page.json();
    try {
        document.title = `${page.name} - ${project_page.name}`;
    } catch {
    }

}

import {readPageDetails} from '/src/shared/js/storage.js'

export async function openAsideBar(projectID) {
    const docDetails = readPageDetails("docs");
    if (!projectID in docDetails) {return null}
    const projectDetails = docDetails[projectID];
    for (const page of projectDetails) {
        document.getElementById(page).classList.add("open");
    }
}

export function writeAsideBar(projectID, toggleID) {
    let pageDetails = JSON.parse(sessionStorage.getItem("pageDetails"));
    if (!pageDetails) {pageDetails = {}}
    if (!pageDetails["docs"]) {pageDetails["docs"] = {};}
    if (!pageDetails["docs"][projectID]) {pageDetails["docs"][projectID] = [];}
    const arr = pageDetails.docs[projectID];
    if (!arr.includes(toggleID)) {
        arr.push(toggleID);
    } else {
        pageDetails.docs[projectID] = arr.filter(item => item !== toggleID);
    }
    sessionStorage.setItem("pageDetails", JSON.stringify(pageDetails));
}

export async function loadDocPage(projectID) {
    await setPageTitle(projectID);
    await loadAside(projectID);
    await loadNextPagePointer(projectID);

}



