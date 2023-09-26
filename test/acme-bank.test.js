'use strict';

const { 
  Eyes, ClassicRunner, VisualGridRunner, RunnerOptions, Target,
  RectangleSize, Configuration, BatchInfo, BrowserType, ScreenOrientation,
  DeviceName
} = require('@applitools/eyes-webdriverio');

describe('Apple Flip', function () {
  const USE_ULTRAFAST_GRID = true;
  
  // Applitools objects to share for all tests
  let batch;
  let config;
  let runner;

  // Test-specific objects
  let eyes;

  before(async () => {
    const applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

    runner = USE_ULTRAFAST_GRID 
      ? new VisualGridRunner(new RunnerOptions().testConcurrency(5))
      : new ClassicRunner();

    batch = new BatchInfo('Apple Flip Cards');
    config = new Configuration();
  
    config.setApiKey(applitoolsApiKey);
    config.setBatch(batch);
  

    if (USE_ULTRAFAST_GRID) {
      config.addBrowser(800, 600, BrowserType.CHROME)
            .addBrowser(1600, 1200, BrowserType.FIREFOX)
            .addBrowser(1024, 768, BrowserType.SAFARI)
            .addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT)
            .addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    }
  });

  beforeEach(async function () {
    eyes = new Eyes(runner);
    eyes.setConfiguration(config);
    await eyes.open(browser, 'Apple Flip Card all', 'Apple Flip all', new RectangleSize(1200, 600));
  });

  const scrollDownSmoothly = async (client, scrollAmount = 400) => {
    let previousScrollPosition = 0;
    let currentScrollPosition = await client.execute(() => window.pageYOffset || document.documentElement.scrollTop);

    while (previousScrollPosition !== currentScrollPosition) {
      previousScrollPosition = currentScrollPosition;
      await client.execute((amount) => window.scrollBy(0, amount), scrollAmount);
      await client.pause(500);
      currentScrollPosition = await client.execute(() => window.pageYOffset || document.documentElement.scrollTop);
    }
  };

  it('Apple map Flip Card', async () => {
    await browser.url('https://www.apple.com/maps/');
    await scrollDownSmoothly(browser, 2000);
    await eyes.check(Target.window().fully().withName("Full Page driving"));

    const selector = "#main > div > div:nth-child(2) > section > div > div > div.tile.full.driving.appear.animate";
    await eyes.check(Target.region(selector).fully().withName("driving card"));
    
    $(selector).click();
    browser.pause(5000);
    
    await eyes.check(Target.region(selector).fully().withName("driving After click"));
  });

  it('Apple Flip Card', async () => {
    await browser.url('https://www.apple.com/apple-card/');
    await scrollDownSmoothly(browser, 2000);
    await eyes.check(Target.window().fully().withName("Full Page card"));

    const selector = "#main > section.section.section-tiles-grid > div > div > div.tile.half.mega-merchants.animate.appear > div.front-face > button";
    await eyes.check(Target.region(selector).fully().withName("3% daily cash"));
    
    $(selector).click();
    browser.pause(5000);
    
    await eyes.check(Target.region(selector).fully().withName("card After click"));
  });

  it('Apple iphone Flip Card', async () => {
    await browser.url('https://www.apple.com/iphone/switch/');
    await scrollDownSmoothly(browser, 2000);
    await eyes.check(Target.window().fully().withName("Full Page iphone"));

    const selector = "#move-to-ios";
    await eyes.check(Target.region(selector).fully().withName("ihpone flip"));
    
    $(selector).click();
    browser.pause(5000);
    
    await eyes.check(Target.region(selector).fully().withName("iphone After click"));
  });



  afterEach(async () => {
    await eyes.closeAsync();
  });
  
  after(async () => {
    const allTestResults = await runner.getAllTestResults();
    console.log(allTestResults);
  });
});