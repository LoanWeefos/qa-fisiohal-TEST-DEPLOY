const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC20 — Validar campo ¿Cómo te gusta que lo / te llamen?, Tienes algún sobrenombre o apodo que le/te guste?", function () {
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
      logger.info("\nEjecutando TC20 — Validar campo ¿Cómo te gusta que lo / te llamen?, Tienes algún sobrenombre o apodo que le/te guste? | 20 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo debe aceptar texto, inidicar con un mensaje de advertencia", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const apodoInput = await global.helper.findOrFail(
      "//span[normalize-space()='¿Cómo te gusta que lo / te llamen?']" +
      "/ancestor::flowruntime-lwc-field//input",
      "Campo ¿Cómo te gusta que lo / te llamen? - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].focus(); arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      apodoInput
    );
    await global.driver.sleep(150);

    const textoValido = "María López";
    await apodoInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await apodoInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      apodoInput
    );
    await global.driver.sleep(150);

    await apodoInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await apodoInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      apodoInput
    );
    await global.driver.sleep(150);

    await apodoInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await apodoInput.getAttribute("value")).trim();

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