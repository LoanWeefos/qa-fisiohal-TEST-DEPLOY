const assert = require("assert");
const { By, until } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC02 — Validar permisos de creación de Account", function () {
  this.timeout(0);

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC02 — Validar permisos de creación de Account | 2 de 11\n");
    }

    await global.helper.goToAccounts();
  });

  it("Debe abrir el formulario New Account", async () => {
    await global.helper.safeFindAndClick(
      "//a[@role='button' and @title='New']",
      "Boton New Account - Debe hacer clic en el botón New para abrir el formulario de creación de cuenta"
    );

    const modal = await global.helper.findOrFail(
      "//h2[contains(normalize-space(),'New')]",
      "Modal New Account - Debe mostrarse el modal de creación de cuenta al hacer clic en el botón New"
    );

    assert.ok(modal);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
