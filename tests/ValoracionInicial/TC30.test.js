const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC30 — Validar campo ¿Tiene algún diagnóstico o cual es el motivo de su visita?", function () {
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
      logger.info("\nEjecutando TC30 — Validar campo ¿Tiene algún diagnóstico o cual es el motivo de su visita? | 30 de 105\n");
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

    await global.helper.clickNext(2);

    const diagnosticoInput = await global.helper.findOrFail(
      "//input[@name='Diagnostico_Motivo_Visita__c']",
      "Campo Diagnóstico / Motivo de visita - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].focus(); arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      diagnosticoInput
    );
    await global.driver.sleep(150);

    const textoValido = "Dolor lumbar crónico";
    await diagnosticoInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await diagnosticoInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      diagnosticoInput
    );
    await global.driver.sleep(150);

    await diagnosticoInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await diagnosticoInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      diagnosticoInput
    );
    await global.driver.sleep(150);

    await diagnosticoInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await diagnosticoInput.getAttribute("value")).trim();

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