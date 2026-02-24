const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC58 — Validar campo ¿Qué sustancia usas, cuántas veces y con qué frecuencia?", function () {
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
      logger.info("\nEjecutando TC58 — Validar campo ¿Qué sustancia usas, cuántas veces y con qué frecuencia? | 58 de 105\n");
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

    const drogasSelect = await global.helper.findOrFail(
      "//select[@name='Usas_alguna_droga_o_sustancia_recreativa_como_marihuana_coca_na_etc']",
      "Campo ¿Usas alguna droga o sustancia recreativa? - No se encuentra en el formulario"
    );

    await drogasSelect.sendKeys("No");
    await global.driver.sleep(300);

    let detalleDrogaInput = await global.driver.findElements(
      By.xpath("//input[@name='Uso_de_drogas_o_sustancias_recreativas']")
    );

    assert.strictEqual(
      detalleDrogaInput.length,
      0,
      "El campo '¿Qué sustancia usas, cuántas veces y con qué frecuencia?' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await drogasSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await drogasSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    detalleDrogaInput = await global.driver.findElements(
      By.xpath("//input[@name='Uso_de_drogas_o_sustancias_recreativas']")
    );

    assert.ok(
      detalleDrogaInput.length > 0 &&
      (await detalleDrogaInput[0].isDisplayed()),
      "El campo '¿Qué sustancia usas, cuántas veces y con qué frecuencia?' debería mostrarse al seleccionar 'Si'"
    );

    const input = detalleDrogaInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Marihuana de forma ocasional los fines de semana";
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