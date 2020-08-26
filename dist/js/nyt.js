/* script.js */

const sectionOptions = document.querySelector("#news_sections")
const articleContainer = document.querySelector("#article-container")
const numberOfStories = document.querySelector("#numOfStories")
const refreshBtn = document.querySelector("#refresh_btn")

const apiKey = '7PjU9GmG7xbVhGYhV2OK575FwMIeVvcG'
let articleURL = `http://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`

// for dynamically building a section URL - not in use, keeping for reference
// const sectionURL = `https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=${apiKey}`

function fetchAPIData(url, userFunction) {
    console.log(url)
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            userFunction(data)
        })
        .catch(err => {
            console.log(err)
        })
}

function displayArticles(data) {
    let articles = ''

    for (let i = 0; i < data.results.length; i++) {
        let featureImg = `<a href="${data.results[i].short_url}" title="Go to article"><img src="${data.results[i].multimedia[0].url}" alt="${data.results[i].multimedia[0].caption}" height="450"></a>`
        let thumbnailImg = `<a href="${data.results[i].short_url}" title="Go to article"><img src="${data.results[i].multimedia[2].url}" alt="${data.results[i].multimedia[2].caption}" height="150"></a>`
        let featuredSection = `<p class="featured-article-section">${data.results[i].section}</p>`
        let section = `<p class="article-section">${data.results[i].section}</p>`
        let featuredTitle = `<h1 class="featured-title"><a href="${data.results[i].short_url}" title="Go to article">${data.results[i].title}</a></h1>`
        let title = `<h1><a href="${data.results[i].short_url}" title="Go to article">${data.results[i].title}</a></h1>`
        let featuredAbstract = `<p class="featured-abstract">${data.results[i].abstract}</p>`
        let abstract = `<p>${data.results[i].abstract}</p>`
        let byline = `<p>${data.results[i].byline}<p>`
        let datePublished = `<p>${moment(data.results[i].published_date).format("dddd, MMMM Do, YYYY")}<p>`

        if (i == 0) {
            articles +=
                `<div class="feature-article-item">
                    <div class="articles__feature-img-container">
                        ${featureImg}
                        ${featuredSection}
                    </div>
                    <div class="articles__feature-text-container">
                        <div class="article-title">
                            ${featuredTitle}
                        </div>
                        <div class="article-info">
                            ${byline}
                            ${datePublished}
                        </div>
                        <div class="article-content">
                            ${featuredAbstract}
                        </div>
                    </div>
                </div>`
        } else {
            articles +=
                `<div class="article-item">
                    <div class="articles__img-container">
                        ${thumbnailImg}
                        ${section}

                    </div>
                    <div class="articles__text-container">
                        <div class="article-title">
                            ${title}
                        </div>
                        <div class="article-info">
                            ${byline}
                            ${datePublished}
                        </div>
                        <div class="article-content">
                            ${abstract}
                        </div>
                    </div>
                </div>`
        }
    }
    articleContainer.innerHTML = articles
}

function displayNumberOfResults(data) {
    if (data.num_results == undefined || data.num_results == 0) {
        articleContainer.innerHTML = `<p class="addHeight">No stories found. Please try again.</p>`
    } else {
        numberOfStories.innerHTML = `<p>${data.num_results} stories found</p>`
        setTimeout(() => {
            numberOfStories.innerHTML = '<div class="addHeight"></div>'
        }, 5000)
    }
}

// this function is not currently in use - keeping for future reference
function buildSectionOptions(data) {
    let newsOptions = ''
    data.results.forEach(element => {
        let inputValue = element.section
        let inputLabel = element.display_name

        if (inputValue != "admin") {
            newsOptions += `<option value="${inputValue}">${inputLabel}</option>`
        }
    })
    sectionOptions.innerHTML = newsOptions
}

sectionOptions.addEventListener("change", () => {
    articleURL = `http://api.nytimes.com/svc/topstories/v2/${sectionOptions.value}.json?api-key=${apiKey}`
    // display stories
    fetchAPIData(articleURL, displayArticles)
    // display number of stories
    fetchAPIData(articleURL, displayNumberOfResults)
})

refreshBtn.addEventListener("click", () => {
    // display stories
    fetchAPIData(articleURL, displayArticles)
    // display number of stories
    fetchAPIData(articleURL, displayNumberOfResults)
})

// display stories
fetchAPIData(articleURL, displayArticles)

// display number of stories
fetchAPIData(articleURL, displayNumberOfResults)

// build select - not in use
// fetchAPIData(sectionURL, buildSectionOptions)
