// lander.page.js
// http://webdriver.io/guide/testrunner/pageobjects.html
// https://www.npmjs.com/package/node-fetch
import Page from './page';

// This class contains Page Object Locators and methods for the Lander Screen.
// It inherits from  Page.
class Lander extends Page {

  // ReactNative testID
  // In horizontallistitem.youi.js, testID has been set in ButtonRef to reflect the movie's id.
  // Within the app, each poster will contain it's ID in the 'rntestid' attribute.
  // This can be used to extract the Movie's PDP.

  // '$' is equivalent to 'browser.element'
  // http://webdriver.io/api/utility/$.html
  // http://webdriver.io/guide/usage/selectors.html
  // To search for name: $('name:mySelector') or $('~mySelector')
  // To search for class name: $('class name:mySelector')
  // To search for id: $('id:mySelector')

  // Page Elements
  get btn_profile()  { return $("~Btn-Profile"); }
  get displayed_poster()  { return $("~Poster[@isDisplayed='true']"); }
  get focused_poster()  { return $("~Poster[@hasFocus='true']"); }
  get root_node()  { return $("~React"); }
  
  // Page Methods

  // Returns the id of the movie/poster in focus.
  get_focused_movie_id = () => this.focused_poster.getAttribute("rntestid");

  // Navigates to the begining of the next row.
  // Note: Expects to be directly above that row.
  navigate_to_begining_of_next_row() {
    // Move down to next row.
    this.root_node.setValue('ArrowDown');
    // Move to start of the row.
    let previous_id;
    let new_id;
    do {
      previous_id = new_id;
      this.root_node.setValue('ArrowLeft');
      new_id = this.get_focused_movie_id();
    }
    while (previous_id != new_id);
  }
}

export default new Lander()
