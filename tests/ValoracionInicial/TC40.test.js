const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC40 — Validar campo ¿Cuenta con algún otro dispositivo médico?", function () {
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
      logger.info("\nEjecutando TC40 — Validar campo ¿Cuenta con algún otro dispositivo médico? | 40 de 105\n");
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

    const dispositivoInput = await global.helper.findOrFail(
      "//span[contains(normalize-space(),'¿Cuenta con algún otro dispositivo médico')]" +
      "/ancestor::flowruntime-lwc-field//input",
      "Campo ¿Cuenta con algún otro dispositivo médico? - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dispositivoInput
    );

    await dispositivoInput.sendKeys("Marcapasos externo");
    await global.driver.sleep(200);

    let valueUI = (await dispositivoInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      "Marcapasos externo",
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dispositivoInput
    );

    await dispositivoInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await dispositivoInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dispositivoInput
    );

    await dispositivoInput.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = (await dispositivoInput.getAttribute("value")).trim();

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