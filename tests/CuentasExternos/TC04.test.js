const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC04 — First Name obligatorio", function () {
  this.timeout(0);

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC04 — First Name obligatorio | 4 de 11\n");
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

  it("Debe mostrar error en First Name", async () => {
    await global.helper.saveForm();

    const error = await global.helper.findOrFail(
      "//lightning-input[@data-field='firstName' and contains(@class,'slds-has-error')]",
      "Mensaje de error - First Name debe ser campo obligatorio"
    );

    assert.ok(error);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
