const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC15 — Comprobar visibilidad de los campos: Nombre contacto de emergencia, parentesco, número de teléfono familiar responsable por usuario", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "ehaiden@fisiohal.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC15 — Comprobar visibilidad de los campos: Nombre contacto de emergencia, parentesco, número de teléfono familiar responsable por usuario | 15 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Campos visibles para Coordinación clínica / Coordinación administrativa", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const nombreField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Nombre familiar responsable']/ancestor::flowruntime-lwc-field")
    );

    assert.ok(
      nombreField.length > 0 && await nombreField[0].isDisplayed(),
      "La Secretaria debe ver el campo 'Nombre contacto de emergencia'"
    );

    const parentescoField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Parentesco']/ancestor::flowruntime-lwc-field")
    );

    assert.ok(
      parentescoField.length > 0 && await parentescoField[0].isDisplayed(),
      "La Secretaria debe ver el campo 'Parentesco'"
    );

    const telefonoField = await global.driver.findElements(
      By.xpath("//span[normalize-space()='Número de teléfono familiar responsable']/ancestor::flowruntime-lwc-field")
    );

    assert.ok(
      telefonoField.length > 0 && await telefonoField[0].isDisplayed(),
      "La Secretaria debe ver el campo 'Teléfono familiar responsable'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
