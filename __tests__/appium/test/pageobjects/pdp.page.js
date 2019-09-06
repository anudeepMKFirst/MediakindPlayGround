// pdp.page.js
// http://webdriver.io/guide/testrunner/pageobjects.html
// https://www.npmjs.com/package/node-fetch
import Page from './page';

// This class contains Page Object Locators and methods for the PDP Screen.
// It inherits from  Page.
class PDP extends Page
{
  // '$' is equivalent to 'browser.element'
  // http://webdriver.io/api/utility/$.html
  // http://webdriver.io/guide/usage/selectors.html
  // To search for name: $('name:mySelector') or $('~mySelector')
  // To search for class name: $('class name:mySelector')
  // To search for id: $('id:mySelector')

  // Page Elements

  get btn_play() { return $("~Btn-Play"); }
  get focused_poster() { return $("class name:CYIPushButtonView[@hasFocus='true']"); }
  get page_title() { return $("~Title-Text"); }
  get page_body() { return $("~Body-Text"); }
  get root_node()  { return $("~React"); }

  // Page Methods

  // Grabs next recommended poster
  get_next_recommended = index =>  $("~Poster" + index);
}

export default new PDP ()
