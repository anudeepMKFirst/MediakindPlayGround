import { expect } from 'chai'; // https://www.chaijs.com/
import Backend from '../pageobjects/backend';
import Lander from '../pageobjects/lander.page';
import PDP from '../pageobjects/pdp.page';


// http://webdriver.io/api/protocol/timeoutsImplicitWait.html
browser.timeoutsImplicitWait(30000);
let movie_id
// This group represents the tests for the Lander screen.
describe('Lander Tests', () => {

  context('when in Lander', () => {
    it('captures a screenshot of Lander page', () => {
      let dir = "./screenshots/";
      let filename = "lander.png";
      Lander.displayed_poster;
      Lander.saveScreenshot(dir, filename);
      let fs = require('fs');
      expect(fs.existsSync(dir + filename)).to.be.true;
    });
    // Check if poster is in focus
    it('has a poster in focus', () => {
      expect(Lander.focused_poster.getAttribute("hasFocus")).to.be.true;
    });
    it('fetches the pdp details from the backend',() => {
      movie_id = Lander.get_focused_movie_id();
      expect(Backend.get_title(movie_id)).to.not.be.empty;
    });
    it('navigates to PDP by clicking Enter', () => {
      // Clicking Enter on focused poster.
      Lander.root_node.setValue("Enter");
      // Wait until the screen is loaded and displayed.
      browser.waitUntil(() => {
        return PDP.page_title.getAttribute("isdisplayed") === true;
      }, 10000, 'expected text to be different after 10s');
      expect(PDP.page_title.getAttribute("isdisplayed")).to.be.true;
    });
    it('navigates back to Lander by using back button', () => {
      browser.back();
      browser.waitUntil(() => {
        return Lander.btn_profile.getAttribute("isdisplayed") === true;
      }, 10000, 'expected text to be different after 10s');
      expect(Lander.btn_profile.getAttribute("isdisplayed")).to.be.true;
    });
  });

  context('when navigating list', () => {
    it('focuses each poster', () => {
    /* We are only validating the number of posters and not the IDs themselves
    since the app caches the database and there could be a mismatch. */
    // Loop pages
      for (let page_index = 1; page_index <= 2; page_index++) {
        // Navigating to the start of first row.
        let poster_index = 0;
        // Loop Rows
        for (let row_index = 1; row_index <= 2; row_index++) {
          if (page_index != 1 || row_index != 1) Lander.navigate_to_begining_of_next_row();
          // Loop Posters
          let previous_id;
          let new_id;
          do {
            poster_index += 1;
            previous_id = Lander.get_focused_movie_id();
            Lander.root_node.setValue("ArrowRight");
            new_id = Lander.get_focused_movie_id();
          } while (previous_id != new_id);
        };
        expect(poster_index).to.equal(Backend.get_movie_list_length(page_index));
      };
    });
  });
});

