// backend.js
// http://webdriver.io/guide/testrunner/pageobjects.html

import fetch from 'node-fetch';

// This class contains Backend fetch calls from external APIs.
// Since this page is an abstraction, it does not inherit from Page.

class Backend
{
  // Fetches a new page from the Movie list from the backend and stores it in $movie_list.
  fetch_movie_list(page_index) {
    // Using browser.call to call an async 3rd party library
    // https://webdriver.io/docs/api/browser/call.html
    return browser.call(() => fetch(`https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en&page=${page_index}`)
      .then(response => response.json())
      .catch(error => console.error(error))
    );
  }

  get_movie_list_length = page_index => this.fetch_movie_list(page_index)['results'].length

  // Fetches new pdp details from the backend based on a Movie ID.
  fetch_pdp_details(id) {
    return browser.call(() => fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits,recommendations,videos&language=en`)
      .then(response => response.json())
      .catch(error => console.error(error))
    );
  }

  // Fetches the title for an id from the backend.
  get_title = id => this.fetch_pdp_details(id)["title"];

  // Fetches the overview from the backend for an id.
  get_overview = id => this.fetch_pdp_details(id)["overview"];

  //
  get_recommended_length = id => this.fetch_pdp_details(id)["recommendations"]["results"].length;
}

export default new Backend()
