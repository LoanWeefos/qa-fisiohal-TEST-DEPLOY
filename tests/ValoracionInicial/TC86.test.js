const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC86 — Validar campo ¿Cuándo y cómo se presenta el dolor?", function () {
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
      logger.info("\nEjecutando TC86 — Validar campo ¿Cuándo y cómo se presenta el dolor? | 86 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo debe aceptar texto", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(5);

    const dolorInput = await global.helper.findOrFail(
      "//input[@name='Cuando_y_c_mo_se_presenta_el_dolor']",
      "Campo ¿Cuándo y cómo se presenta el dolor? - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dolorInput
    );

    const textoValido = "Al caminar por las mañanas";
    await dolorInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await dolorInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dolorInput
    );

    await dolorInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await dolorInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      dolorInput
    );

    await dolorInput.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = (await dolorInput.getAttribute("value")).trim();

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