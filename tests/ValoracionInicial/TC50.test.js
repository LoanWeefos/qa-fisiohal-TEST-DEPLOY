const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC50 — Validar campo ¿Por qué fue necesaria la transfusión?, si recuerdas ¿cuando la realizaron?", function () {
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
      logger.info("\nEjecutando TC50 — Validar campo ¿Por qué fue necesaria la transfusión?, si recuerdas ¿cuando la realizaron? | 50 de 105\n");
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

    const transfusionSelect = await global.helper.findOrFail(
      "//select[@name='Alguna_vez_te_han_hecho_una_transfusi_n_de_sangre']",
      "Campo ¿Alguna vez te han hecho una transfusión de sangre? - No se encuentra en el formulario"
    );

    await transfusionSelect.sendKeys("No");
    await global.driver.sleep(300);

    let motivoInput = await global.driver.findElements(
      By.xpath("//input[@name='Motivo_y_fecha_de_la_transfusi_n']")
    );

    assert.strictEqual(
      motivoInput.length,
      0,
      "El campo 'Motivo y fecha de la transfusión' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await transfusionSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await transfusionSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    motivoInput = await global.driver.findElements(
      By.xpath("//input[@name='Motivo_y_fecha_de_la_transfusi_n']")
    );

    assert.ok(
      motivoInput.length > 0 && await motivoInput[0].isDisplayed(),
      "El campo 'Motivo y fecha de la transfusión' debería mostrarse al seleccionar 'Si'"
    );

    const input = motivoInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Cirugía de emergencia marzo";
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