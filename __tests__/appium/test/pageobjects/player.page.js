// player.page.js
// http://webdriver.io/guide/testrunner/pageobjects.html
// https://www.npmjs.com/package/node-fetch
import Page from './page';

class Player extends Page
{
  get video_surface() { return $("~Video-Surface-View");}
}

export default new Player()
