# Bookstore Search
Simulate a bookstore website search page using HTML, CSS, JavaScript, and Google's Book API.
<br/> [Live Demo](https://bookstore.leeorburton.com)

## Introduction
My first time using an API! This was originally part of a class project where we were initially introduced to utilizing public APIs using JavaScript. For my assignment, I chose to build out part of an existing project of mine where I redesigned the UI of a local bookstore's website. Since this was my first introduction to APIs there was a little bit of trial and error involved. Specifically, I feel like was my first time really having to read and understand documentation on my own. It took a little bit of time to get the hang of whats going on, but its obviously become a very important skill as I've progressed in my career. 

This was also my first time really working with asynchronous JavaScript, but after a few (or more than a few) console logs it all started to come together.

## Endpoint
The query is defined in the loadList function based on a few different dependencies.

```js
if (searchType == 'none') {
        searchQ = 'https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&maxResults=' + perPage + '&q=' + userInput + '&startIndex=' + (lastPage * perPage) + '&orderBy=' + sortSet;
    } else {
        searchQ = 'https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&maxResults=' + perPage + '&q=' + searchType + ':' + userInput + '&startIndex=' + (lastPage * perPage) + '&orderBy=' + sortSet;
    }
```

First, the if statement determines whether the request is coming from the user, or the first load. This is so that we can ensure the 'next' button will only appear once the user has executed a search.

Next, we can formulate the query using parameters defined in the API's documentation. The parameters used in this case are:
- **printType**: restrict results to books only. At this point, the user is not able to change this parameter.
- **langRestrict**: restrict volumes returned to those that are tagged as english (en). At this point, the user is not able to change this parameter.
- **maxResults**: limits how many results are to be displayed at a time. This is defined via the 'perPage' variable. At this point, the user is not able to change this parameter.
- **q**: the query string including search fields. In this case, 2 different variables are passed to specify user inputs.
  -  **searchType**: specifies if the user has selected a particular search field (ex. search by author)
  -  **userInput**: sanitized value the user inputed into the search bar (aka their search!)
- **startIndex**: the position in the collection to start the list of results. This is used in conjunction with the maxResults parameter for pagination. This also determines whether or not to display the 'next' and 'back' buttons based on location within the collection.
- **orderBy**: determines the order of the search results based on the user's input stored in the 'sortSet' variable.


For a full project breakdown [visit my portfolio](https://leeorburton.com/search.html)
<br/>To view the API Documentation [view the Google Books guide](https://developers.google.com/books/docs/v1/using#query-params)
