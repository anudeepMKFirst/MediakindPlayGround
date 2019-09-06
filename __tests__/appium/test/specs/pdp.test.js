import { expect } from 'chai'; // https://www.chaijs.com/
import Backend from '../pageobjects/backend';
import PDP from '../pageobjects/pdp.page';
import Player from '../pageobjects/player.page';

//http://appium.io/docs/en/commands/session/timeouts/implicit-wait/
browser.timeoutsImplicitWait(30000);
let movie_id;
// This group represents the tests for the PDP screen.
describe('PDP Tests', () => {
  
  context('when in App', () => { 
    it('navigates to PDP by selecting focused movie', () => {
      // Wait until page is loaded before expecting value
      browser.waitUntil(()=> {
        return PDP.root_node.getAttribute("isdisplayed") === true;
      }, 10000, 'expected root node to be loaded');
      PDP.root_node.setValue('Enter');
      movie_id = PDP.focused_poster.getAttribute("rntestid");
      browser.waitUntil(() => {
        return PDP.page_title.getAttribute("isdisplayed") === true;
      }, 10000, 'expected text to be different after 10s');
      // Check that PDP title  matches title from backend
      expect(Backend.get_title(movie_id)).to.equal(PDP.page_title.getText());
      // Check that PDP description  matches description from backend
      expect(Backend.get_overview(movie_id)).to.equal(PDP.page_body.getText());
      // Check that Poster is in Focus
      expect(PDP.btn_play.getAttribute("hasFocus")).to.be.true; 
    }),
    it('captures a screenshot of PDP page', () => {
      let dir = "./screenshots/";
      let filename = "pdp.png";
      PDP.saveScreenshot(dir, filename);
      let fs = require('fs');
      expect(fs.existsSync(dir + filename)).to.be.true;
    });
	});

  context('when selecting the main Poster', () => {
    // Clicking on poster redirects to Video player
    it('navigates to Player by clicking Enter', () => {
    PDP.root_node.setValue("Enter");
    browser.waitUntil(() => {
      return Player.video_surface.getAttribute("isdisplayed") === true
    }, 30000);
    expect(Player.video_surface.getAttribute("isdisplayed")).to.be.true;
    })
  })

  context('when in Player and pressing escape', () => {
    //Clicking ESC redirects back to PDP
    it('returns to PDP', () => {
    browser.back();
    browser.waitUntil(() => {
      return PDP.page_title.getAttribute("isdisplayed") === true
    }, 30000);
    expect(PDP.page_title.getAttribute("isdisplayed")).to.be.true;
    })
  })
  
  context('when pressing right arrow key', () => {
    it('can navigate and focus recommended movies properly', () => {
      let recommended_length = Backend.get_recommended_length(movie_id);
      recommended_length > 4 ? recommended_length = 4 : null
      for(let i = 0; i < recommended_length; i++) {
        PDP.root_node.setValue("ArrowRight");
        let poster = PDP.get_next_recommended(i+1);
        expect(poster.getAttribute("hasFocus")).to.be.true;
      };
    });
  });
});
