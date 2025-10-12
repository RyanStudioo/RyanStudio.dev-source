
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
        const parent = document.createElement("li");
        asideContainer.appendChild(parent)
        if (!("children" in doc)) {
            const title = document.createElement("a");
            title.href = doc.href;
            title.textContent = doc.name;
            parent.appendChild(title);
            title.classList.add("category-title")
            parent.classList.add("page-title");
        } else {
            const title = document.createElement("a");
            title.textContent = doc.name;
            title.classList.add("category-title")
            const pages = document.createElement("ul");
            pages.classList.add("page-container");
            parent.classList.add("aside-category");
            parent.appendChild(title)
            parent.appendChild(pages)
            for (const subpage of doc.children) {
                const pageList = document.createElement("li");
                const pageTitle = document.createElement("a");
                pageList.appendChild(pageTitle);
                pageTitle.href = subpage.href;;
                pageTitle.textContent = subpage.name;
                pages.appendChild(pageList);
                pageTitle.classList.add("page");
            }
        };

    }
    const categories = document.querySelectorAll(".aside-category .category-title")
    categories.forEach(element => {
        element.addEventListener("click", (event => {
            event.preventDefault()
            element.parentElement.classList.toggle("open")
        }))
    })
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
        if ("children" in project) {
            for (const page of project.children) {
                flatPages.push(page.href)
            }
        } else {
            flatPages.push(project.href)
        }
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