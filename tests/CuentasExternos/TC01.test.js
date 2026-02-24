const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC01 — Acceso a Accounts y botón New", function () {
  this.timeout(0);

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC01 — Acceso a Accounts y botón New | 1 de 11\n");
    }
    
    await global.helper.goToAccounts();
  });

  it("Debe mostrarse el botón New", async () => {
    const newButton = await global.helper.findOrFail(
      "//a[@role='button' and @title='New']",
      "Botón New - Debe mostrarse el botón New"
    );

    assert.ok(newButton);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
