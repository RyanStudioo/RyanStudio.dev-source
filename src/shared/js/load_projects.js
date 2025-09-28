export async function loadArticles() {
    const response = await fetch('/projects/articles.json');
    const articles = await response.json();
    return articles;
}

export async function getArticle(articleName) {
    const response = await loadArticles()
    return response[articleName]
}

export function createArticleSliderElement(article) {
    try {
    const section = document.createElement('section');
    section.classList.add('article-container');
    let image = article.image;
    let title = article.title;
    let description = article.description;

    section.innerHTML = `
        <img src="${image}">
        <h1>${title}</h1>
        <p>${description}</p>    
    `
    if ("href" in article) {
        const parent = document.createElement('a');
        let href = article.href
        parent.appendChild(section)
        parent.href = href
        parent.classList.add("remove-decoration")
        return parent
    } 
    return section;} catch (error) {
        console.error("Error creating article slider element:", error);
        return document.createElement('div');
    }
}

export async function createProjectsPage(projectKey) {
    if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
        const response = await getArticle(projectKey)
        console.log(response)
        const mainImage = response.image
        document.getElementById('main-image').src = mainImage
        document.getElementById('title').textContent = response.title
        document.getElementById('description').innerHTML = response.description

        const parent = document.getElementById("feature-box-container")

        for (const article of response.features) {
            const articleDiv = document.createElement("section")
            articleDiv.classList.add("feature-box")
            const featureTitle = document.createElement("h1")
            featureTitle.textContent = article.title
            const featureDescription = document.createElement("p")
            featureDescription.textContent = article.description
            articleDiv.appendChild(featureTitle)
            articleDiv.appendChild(featureDescription)
            parent.appendChild(articleDiv)
        }

        const sideBar = document.getElementById("side-bar")
        for (const link of response.sidebar) {
            const hrefElement = document.createElement("a")
            hrefElement.textContent = link.title
            hrefElement.href = link.href
            sideBar.appendChild(hrefElement)
        }

        const width = parent.offsetWidth
        parent.addEventListener("wheel", (e) => {
                e.preventDefault();
                parent.scrollLeft += e.deltaY 
            })
        window.addEventListener("scroll", () => {
        const offset = window.scrollY * 0.5; // slower than scroll
        document.querySelector(".main-article-image").style.transform = `translateY(${offset}px)`;
        });
        document.title = `${response.title} - RyanStudio.dev`
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = response.description;
        document.head.appendChild(meta)
}