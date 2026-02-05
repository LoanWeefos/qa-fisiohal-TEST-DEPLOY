const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC03 — Fecha de nacimiento obligatoria", function () {
  this.timeout(0);

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC03 — Fecha de nacimiento obligatoria | 3 de 11\n");
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

  it("Debe mostrar error en Fecha de Nacimiento", async () => {
    await global.helper.saveForm();

    const error = await global.helper.findOrFail(
      "//div[contains(@id,'error-message') and normalize-space()!='']",
      "Error en Fecha de Nacimiento"
    );

    assert.ok(error);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
