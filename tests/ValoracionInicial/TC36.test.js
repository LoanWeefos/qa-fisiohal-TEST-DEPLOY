const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC36 — Validar campo Especificar alergias", function () {
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
      logger.info("\nEjecutando TC36 — Validar campo Especificar alergias | 36 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo debe aceptar texto, inidicar con un mensaje de advertencia", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(2);

    const alergiasSelect = await global.helper.findOrFail(
      "//select[@name='Alergias']",
      "Campo Alergias"
    );

    const opcionSiEspecificar = await alergiasSelect.findElement(
      By.xpath(".//option[@value='SiEspecificar']")
    );

    await alergiasSelect.click();
    await opcionSiEspecificar.click();
    await global.driver.sleep(300);

    const especificarInput = await global.helper.findOrFail(
      "//input[@name='Especificar_alergias']",
      "Campo Especificar alergias"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      especificarInput
    );

    const textoValido = "Polen";
    await especificarInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await especificarInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      especificarInput
    );

    await especificarInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await especificarInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      especificarInput
    );

    await especificarInput.sendKeys("@#$%");
    await global.driver.sleep(200);

    valueUI = (await especificarInput.getAttribute("value")).trim();

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