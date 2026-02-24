const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC02 — Comprobar el campo Fecha de Nacimiento", function () {
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
      logger.info("\nEjecutando TC02 — Comprobar el campo Fecha de Nacimiento | 2 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo fecha de nacimiento deberá mostrar la fecha de nacimiento del paciente", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const fechaNacimientoInput = await global.helper.findOrFail(
      "//label[normalize-space()='Fecha de Nacimiento']/following::input[1]",
      "Campo Fecha de Nacimiento - El sistema no muestra la fecha de nacimiento del paciente"
    );

    const fechaValue = (await fechaNacimientoInput.getAttribute("value")).trim();

    assert.ok(
      fechaValue.length > 0,
      "La fecha de nacimiento no se muestra en el campo"
    );

    const isDisabled = await fechaNacimientoInput.getAttribute("disabled");
    const isAriaDisabled = await fechaNacimientoInput.getAttribute("aria-disabled");
    const isReadOnly = await fechaNacimientoInput.getAttribute("readonly");

    assert.ok(
      isDisabled !== null ||
      isAriaDisabled === "true" ||
      isReadOnly !== null,
      "El campo Fecha de Nacimiento debe ser de solo lectura"
    );

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
