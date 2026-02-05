const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC05 — Verificar campo Teléfono solo acepte numeros", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC05 — Verificar campo Teléfono solo acepte numeros | 5 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Se muestra mensaje de validación indicando que solo se permite capturar números", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const telefonoInput = await global.helper.findOrFail(
      "//label[normalize-space()='Teléfono']/following::input[@type='tel'][1]",
      "Campo Teléfono - No se encuentra en el formulario"
    );

    await telefonoInput.click();
    await telefonoInput.sendKeys(Key.CONTROL, "a");
    await telefonoInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(300);

    const letras = "abcdef";
    await telefonoInput.sendKeys(letras);
    await global.driver.sleep(300);

    const telefonoUI = (await telefonoInput.getAttribute("value")).trim();

    const tieneLetras = /[a-zA-Z]/.test(telefonoUI);

    assert.strictEqual(
      tieneLetras,
      false,
      `El campo Teléfono no debe aceptar letras. Quedó: "${telefonoUI}"`
    );

    assert.ok(
      telefonoUI === "" || /^\d+$/.test(telefonoUI),
      `El campo Teléfono solo debe contener números. Quedó: "${telefonoUI}"`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
