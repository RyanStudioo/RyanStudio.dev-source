export async function loadArticles() {
    const response = await fetch('/projects/articles.json');
    const articles = await response.json();
    return articles;
}

function loadArticle(articleName) {

}

export function createArticleSliderElement(article) {
    try {
    const href = document.createElement('a')
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
    return section;} catch (error) {
        console.error("Error creating article slider element:", error);
        return document.createElement('div');
    }
}