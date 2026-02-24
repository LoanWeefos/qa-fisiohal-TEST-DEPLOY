const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC54 — Validar campo ¿Cuántos cigarrillos al día? ¿Desde cuándo?", function () {
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
      logger.info("\nEjecutando TC54 — Validar campo ¿Cuántos cigarrillos al día? ¿Desde cuándo? | 54 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si"`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(3);

    const fumarSelect = await global.helper.findOrFail(
      "//select[@name='Fumas_actualmente_o_has_fumado_antes']",
      "Campo ¿Fumas actualmente o has fumado antes? - No se encuentra en el formulario"
    );

    await fumarSelect.sendKeys("No");
    await global.driver.sleep(300);

    let cigarrillosInput = await global.driver.findElements(
      By.xpath("//input[@name='Cigarrillos_por_d_a_y_desde_cu_ndo']")
    );

    assert.strictEqual(
      cigarrillosInput.length,
      0,
      "El campo '¿Cuántos cigarrillos al día? ¿Desde cuándo?' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await fumarSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await fumarSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    cigarrillosInput = await global.driver.findElements(
      By.xpath("//input[@name='Cigarrillos_por_d_a_y_desde_cu_ndo']")
    );

    assert.ok(
      cigarrillosInput.length > 0 &&
      (await cigarrillosInput[0].isDisplayed()),
      "El campo '¿Cuántos cigarrillos al día? ¿Desde cuándo?' debería mostrarse al seleccionar 'Si'"
    );

    const input = cigarrillosInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Varios al día desde hace años";
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