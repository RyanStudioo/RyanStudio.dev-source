
function createAsideElement(doc) {
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
        });

        for (const subpage of doc.children) {
            subpages.appendChild(createAsideElement(subpage))
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
        asideContainer.appendChild(createAsideElement(doc))
    };

}
    
function iterateAside(flatPages, project) {
    if ("children" in project) {
            for (const page of project.children) {
                iterateAside(flatPages, page)
            }
        } else {
            flatPages.push(project.href)
        }
    return flatPages
}

async function getNextPagePointer(projectID) {
    const currentPage = window.location.pathname
    var pages = await fetch("/docs/_docpages.json");
    pages = await pages.json();
    var project_page = await fetch(pages[projectID].path);
    project_page = await project_page.json();
    const aside = project_page.aside;
    var flatPages = [];
    for (const project of aside) {
        flatPages = iterateAside(flatPages, project)
    };
    var page = flatPages.indexOf(currentPage);
    if (page < flatPages.length - 1) {
        const nextPage = flatPages[page + 1];
        return nextPage
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
