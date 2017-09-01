import { Ponyracer4Page } from './app.po';

describe('ponyracer4 App', () => {
  let page: Ponyracer4Page;

  beforeEach(() => {
    page = new Ponyracer4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to pr!');
  });
});
