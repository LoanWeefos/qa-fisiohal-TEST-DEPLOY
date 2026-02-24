const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC12 — Validar campo Nombre contacto de emergencia solo acepte texto", function () {
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
      logger.info("\nEjecutando TC12 — Validar campo Nombre contacto de emergencia solo acepte texto | 12 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo permite el ingreso de texto", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const nombreInput = await global.helper.findOrFail(
      "//span[normalize-space()='Nombre familiar responsable']" +
      "/ancestor::div[contains(@class,'flowruntime-input')]//input",
      "Campo Nombre familiar responsable - No se encuentra en el formulario"
    );

    await nombreInput.click();
    await nombreInput.sendKeys(Key.CONTROL, "a");
    await nombreInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(200);

    const textoValido = "María López";
    await nombreInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await nombreInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await nombreInput.clear();
    await global.driver.sleep(200);

    await nombreInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await nombreInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await nombreInput.clear();
    await global.driver.sleep(200);

    await nombreInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await nombreInput.getAttribute("value")).trim();

    assert.ok(
      !/[^a-zA-ZÀ-ÿ\s]/.test(valueUI),
      `El campo permitió símbolos. Valor actual: "${valueUI}"`
    );

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
