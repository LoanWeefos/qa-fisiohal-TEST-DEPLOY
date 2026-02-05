const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC06 — Phone obligatorio", function () {
  this.timeout(0);

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC06 — Phone obligatorio | 6 de 11\n");
    }

    await global.helper.goToAccounts();
    await global.helper.safeFindAndClick(
      "//a[@role='button' and @title='New']",
      "Boton New Account"
    );
    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cuenta Externa']/ancestor::label",
      "Opción Cuenta Externa"
    );
    await global.helper.safeFindAndClick(
      "//button[.//span[normalize-space()='Next']]",
      "Boton Next"
    );
  });

  it("Debe mostrar error en Phone", async () => {
    await global.helper.saveForm();

    const error = await global.helper.findOrFail(
      "//input[@name='Phone']/ancestor::lightning-primitive-input-simple//div[contains(@class,'slds-form-element__help') and normalize-space()]",
      "Error en Phone"
    );

    assert.ok(error);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
