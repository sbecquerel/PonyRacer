import { browser, by, element } from 'protractor';

export class Ponyracer4Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('pr-root h1')).getText();
  }
}
