let searchInput = document.querySelector('#search');
let searchBtn = document.querySelector('.searchBtn');
let loadmore = document.querySelector('.loadmore-container');
let loadMoreBtn = document.querySelector('.loadmore');
let loadLessBtn = document.querySelector('.loadless');

let sortResults = document.querySelector('#sortBy');
let filterResults = document.querySelector('#searchType');

let lastPage;
let searchQ;
let validInput;

// sets # of results displayed on page
let perPage = 5;

// on first load, run query to display default results without load more buttons
window.onload = firstLoad();

// on button click, sort, filter, or enter, load list
searchBtn.addEventListener("click", loadList);

sortResults.addEventListener("change", loadList);
filterResults.addEventListener("change", loadList);

searchInput.addEventListener("keypress", function (e) {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === "Enter") {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger the button element with a click
        searchBtn.click();
    }
});

// load more or less results on search
loadMoreBtn.addEventListener("click", () => {
    // when "next" button is clicked, increment lasPage and load results
    lastPage++;
    loadList();
});

loadLessBtn.addEventListener("click", () => {
    // when "previous" button is clicked, decrement lasPage and load results
    lastPage--;
    loadList();
});


// set initial search term so results are present before user executes search
// in ideal scenario - these would be more popular but google books API doesn't have popularity sort
function firstLoad() {
    lastPage = 0;
    searchQ = 'https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&maxResults=' + perPage + '&q=%20+inauthor:sarah%20j%20maas' + '&startIndex=' + (lastPage * perPage) + '&orderBy=relevance';

    fetchResults(searchQ, "default");
}



function loadList() {
    // excute search with (sanitized) user search terms/sorts/filters
    let userInput = searchInput.value;
    userInput = encodeURIComponent(userInput);

    let sortSet = document.querySelector('#sortBy').value.toLowerCase();
    let searchType = document.querySelector('#searchType').value.toLowerCase();


    // depending on searchType user selected, change variable value to API's accepted query parameter
    switch (searchType) {
        case 'all':
            searchType = 'none';
            break;
        case 'author':
            searchType = 'inauthor';
            break;
        case 'title':
            searchType = 'intitle';
            break;
        case 'genre':
            searchType = 'subject';
            break;
        case 'isbn':
            searchType = 'isbn';
            break;
    }

    // only if user selected a filter value , apply query parameter
    if (searchType == 'none') {
        searchQ = 'https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&maxResults=' + perPage + '&q=' + userInput + '&startIndex=' + (lastPage * perPage) + '&orderBy=' + sortSet;
    } else {
        searchQ = 'https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&maxResults=' + perPage + '&q=' + searchType + ':' + userInput + '&startIndex=' + (lastPage * perPage) + '&orderBy=' + sortSet;
    }

    // execute search with defined query and with user as source
    fetchResults(searchQ, "user");
}

function clearResults() {
    document.querySelector('.results').innerText = "";
}


function fetchResults(searchQ, source) {

    clearResults();

    // run preloader while processing
    document.querySelector('#spinner').classList.add('preloader');

    // hide buttons while loading
    loadMoreBtn.style.display = 'none';
    loadLessBtn.style.display = 'none';

    // fetch results from api using query defined in loadlist function
    fetch(searchQ)
        .then(
            response => response.json()
        )
        .then((data) => {
            processData(data, source);
        }
        )
        .catch((error) => {
            let container = document.querySelector('.results');
            container.innerText = "Sorry, something went wrong on our end.";
        })
        .finally(() => {
            // once complete, hide preloader
            document.querySelector('#spinner').classList.remove('preloader')
        }
        )
}

function processData(result, source) {

    // toggle next/prev buttons depending on if search was executed by user or on "first load" 
    if (source == "user") {

        // display search hits as long as results are found
        if (result.items != null) {
            let length = result.items.length;

            addToContainer(result);

            // determine which next/prev buttons to display based on location in search results
            if (length === perPage && lastPage === 0) {
                loadMoreBtn.style.display = 'inline-block';
                loadLessBtn.style.display = 'none';
            } else if (length === perPage && lastPage != 0) {
                loadMoreBtn.style.display = 'inline-block';
                loadLessBtn.style.display = 'inline-block';
            } else {
                loadMoreBtn.style.display = 'none';
                loadLessBtn.style.display = 'inline-block';
            }

        } else {
            let container = document.querySelector('.results');
            container.innerText = "Sorry, we could find not anything with that term.";
        }

    } else {
        addToContainer(result);
    }

}

function addToContainer(result) {

    let container = document.querySelector('.results');

    for (let i = 0; i < result.items.length; i++) {

        //result container
        let resultBox = document.createElement('div');
        resultBox.classList.add('result');

        //cover container
        let coverContainer = document.createElement('div');
        coverContainer.classList.add('cover');

        let coverImg = document.createElement('img');
        if (result.items[i].volumeInfo.imageLinks !== undefined) {
            coverImg.src = result.items[i].volumeInfo.imageLinks.smallThumbnail;
        } else {
            coverImg.src = "../img/placeholder.png";
        }
        coverContainer.appendChild(coverImg);

        //content container
        let content = document.createElement('div');
        content.classList.add('content');

        //title container
        let title = document.createElement('div');
        title.innerText = result.items[i].volumeInfo.title;
        title.classList.add('title');
        content.appendChild(title);

        //author container
        let author = document.createElement('div');
        author.innerText = "by " + result.items[i].volumeInfo.authors;
        author.classList.add('author');
        content.appendChild(author);

        //description container
        let desc = document.createElement('p');

        if (result.items[i].volumeInfo.description !== undefined) {
            desc.innerText = result.items[i].volumeInfo.description;
        } else {
            desc.innerText = "Description is not available."
        }

        desc.classList.add('desc');
        content.appendChild(desc);

        resultBox.appendChild(coverContainer);
        resultBox.appendChild(content);

        container.appendChild(resultBox);

    }

}
