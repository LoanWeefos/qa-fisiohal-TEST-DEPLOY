const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC13 — Comprobar visibilidad de los campos: Nombre contacto de emergencia, parentesco, número de teléfono familiar responsable por usuario", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC13 — Comprobar visibilidad de los campos: Nombre contacto de emergencia, parentesco, número de teléfono familiar responsable por usuario | 13 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Campos no visibles para el terapeuta", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const nombreField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Nombre familiar responsable']/ancestor::flowruntime-lwc-field")
    );

    if (nombreField.length > 0) {
      const visible = await nombreField[0].isDisplayed();
      assert.strictEqual(
        visible,
        false,
        "El terapeuta NO debe ver el campo 'Nombre contacto de emergencia'"
      );
    }

    const parentescoField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Parentesco']/ancestor::flowruntime-lwc-field")
    );

    if (parentescoField.length > 0) {
      const visible = await parentescoField[0].isDisplayed();
      assert.strictEqual(
        visible,
        false,
        "El terapeuta NO debe ver el campo 'Parentesco'"
      );
    }

    const telefonoField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Número de teléfono familiar responsable']/ancestor::flowruntime-lwc-field")
    );

    if (telefonoField.length > 0) {
      const visible = await telefonoField[0].isDisplayed();
      assert.strictEqual(
        visible,
        false,
        "El terapeuta NO debe ver el campo 'Teléfono familiar responsable'"
      );
    }
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
