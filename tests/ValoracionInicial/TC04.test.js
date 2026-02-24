const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC04 — Verificar campo Teléfono", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
    Phone: "6441234567",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC04 — Verificar campo Teléfono | 4 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo Teléfono se muestra en layout para usuario Secretaria", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);
    await global.helper.clickNext(1);

    const telefonoInput = await global.helper.findOrFail(
      "//label[normalize-space()='Teléfono']/following::input[@type='tel'][1]",
      "Campo Teléfono - No se encuentra en el formulario"
    );

    const isDisplayed = await telefonoInput.isDisplayed();
    assert.ok(isDisplayed, "El campo Teléfono no se muestra para el usuario Secretaria");

    const telefonoUI = (await telefonoInput.getAttribute("value")).trim();

    assert.ok(
      telefonoUI.length > 0,
      "El campo Teléfono está vacío y debería mostrar el teléfono del paciente"
    );

    assert.strictEqual(
      telefonoUI,
      expected.Phone,
      `Teléfono incorrecto. Esperado: ${expected.Phone}, Encontrado: ${telefonoUI}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
