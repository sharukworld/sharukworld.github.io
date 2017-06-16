import { JiraSharkPage } from './app.po';

describe('jira-shark App', () => {
  let page: JiraSharkPage;

  beforeEach(() => {
    page = new JiraSharkPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
