const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC11 — Verificar que el campo Nacionalidad no sea visible", function () {
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
      logger.info("\nEjecutando TC11 — Verificar que el campo Nacionalidad no sea visible | 11 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Los roles de Coordinación clínica y Coordinación administrativa deben poder ver los campos", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const nacionalidadFields = await global.driver.findElements(
      By.xpath("//button[@aria-label='Nacionalidad']")
    );

    assert.ok(
      nacionalidadFields.length > 0,
      "El campo Nacionalidad debe ser visible para Coordinación clínica / administrativa"
    );

    const telefonoFields = await global.driver.findElements(
      By.xpath("//label[normalize-space()='Teléfono']/following::input[@type='tel'][1]")
    );

    assert.ok(
      telefonoFields.length > 0,
      "El campo Teléfono debe ser visible para Coordinación clínica / administrativa"
    );

    const correoFields = await global.driver.findElements(
      By.xpath("//label[normalize-space()='Correo']/following::input[1]")
    );

    assert.ok(
      correoFields.length > 0,
      "El campo Email debe ser visible para Coordinación clínica / administrativa"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
