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
      "Boton New Account - Debe hacer clic en el botón New para abrir el formulario de creación de cuenta"
    );
    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cuenta Externa']/ancestor::label",
      "Opción Cuenta Externa - Debe seleccionar la opción 'Cuenta Externa' al crear una nueva cuenta"
    );
    await global.helper.safeFindAndClick(
      "//button[.//span[normalize-space()='Next']]",
      "Boton Next - Debe hacer clic en el botón Next para avanzar al formulario de creación de cuenta"
    );
  });

  it("Debe mostrar error en Phone", async () => {
    await global.helper.saveForm();

    const error = await global.helper.findOrFail(
      "//input[@name='Phone']/ancestor::lightning-primitive-input-simple//div[contains(@class,'slds-form-element__help') and normalize-space()]",
      "Error en Phone - Debe mostrarse un mensaje de error indicando que el campo 'Phone' es obligatorio al intentar guardar una cuenta externa sin completar este campo"
    );

    assert.ok(error);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
