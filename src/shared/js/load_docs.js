
export async function loadAside(projectID) {
    const projects = await fetch("/docs/docpages.json");
    const data = await projects.json();
    const project = data[projectID];
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
    const categories = document.querySelectorAll(".aside-category")
    categories.forEach(element => {
        element.addEventListener("click", (event => {
            event.preventDefault()
            element.parentElement.classList.toggle("open")
        }))
    })
    }