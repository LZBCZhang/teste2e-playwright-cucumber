import { ICustomWorld } from './custom-world';
import { config } from './config';
import { Before, BeforeAll, AfterAll, Status, setDefaultTimeout, After } from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
} from 'playwright';

import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'traces';

declare global {
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
      break;
  }
  await ensureDir(tracesDir);
});

Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  //customize the browser context
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: { dir: 'screenshots' },
    viewport: { width: 1400, height: 1000 },
  });

  /*
   this.server = axios.create();
   this.server.defaults.baseURL = config.BASE_API_URL;
   this.server.defaults.header.post = {
    'Content-Type': 'application/json'
   };
   this.server.interceptors.response.use((res) => res.data);
   // use bearer
   this.server.defaults.headers.commmon.authorization = 'Bearer '+token;
  * */
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  // @ts-ignore
  this.page.on('console', async (msg) => {
    // @ts-ignore
    if ('log' === msg.type) {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(`Status ${result.status}. Duration: ${result.duration?.seconds}`);
    if (result.status === Status.PASSED) {
      const image = await this.page?.screenshot();
      image && (await this.attach(image, 'image/png'));
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${
          this.startTime?.toISOString().split('.')[0]
        }trace.zip`,
      });
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
