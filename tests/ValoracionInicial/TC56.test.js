const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC56 — Validar campo ¿Cuántas y con qué frecuencia?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC56 — Validar campo ¿Cuántas y con qué frecuencia? | 56 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si"`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(3);

    const alcoholSelect = await global.helper.findOrFail(
      "//select[@name='Tomas_bebidas_alcoh_licas']",
      "Campo ¿Tomas bebidas alcohólicas?"
    );

    await alcoholSelect.sendKeys("No");
    await global.driver.sleep(300);

    let alcoholDetalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Cantidad_y_frecuencia_de_alcohol']")
    );

    assert.strictEqual(
      alcoholDetalleInput.length,
      0,
      "El campo 'Cantidad y frecuencia de alcohol' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await alcoholSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await alcoholSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    alcoholDetalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Cantidad_y_frecuencia_de_alcohol']")
    );

    assert.ok(
      alcoholDetalleInput.length > 0 &&
      (await alcoholDetalleInput[0].isDisplayed()),
      "El campo 'Cantidad y frecuencia de alcohol' debería mostrarse al seleccionar 'Si'"
    );

    const input = alcoholDetalleInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Fines de semana de forma ocasional";
    await input.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = await input.getAttribute("value");

    assert.strictEqual(
      valueUI,
      textoValido,
      "El campo no aceptó texto válido"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[^a-zA-ZÀ-ÿ\s]/.test(valueUI),
      `El campo permitió símbolos. Valor actual: "${valueUI}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});