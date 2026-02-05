const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC98 — Validar campo ¿Cuál deporte, hobbie, actividad recreativa realiza?", function () {
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
      logger.info("\nEjecutando TC98 — Validar campo ¿Cuál deporte, hobbie, actividad recreativa realiza? | 98 de 105\n");
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

    await global.helper.clickNext(6);
    
    const practicaSelect = await global.helper.findOrFail(
      "//select[@name='Practica_alg_n_deporte_hobbie_o_realiza_alguna_actividad_recreativa_frecuente']",
      "Campo Práctica actividad recreativa"
    );

    await practicaSelect.sendKeys("No");
    await global.driver.sleep(300);

    let detalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Deporte_hobbie_o_actividad_recreativa']")
    );

    assert.strictEqual(
      detalleInput.length,
      0,
      "El campo Deporte / Hobbie / Actividad recreativa NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await practicaSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await practicaSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    detalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Deporte_hobbie_o_actividad_recreativa']")
    );

    assert.ok(
      detalleInput.length > 0 && (await detalleInput[0].isDisplayed()),
      "El campo Deporte / Hobbie / Actividad recreativa debería mostrarse al seleccionar 'Si'"
    );

    const input = detalleInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
      input
    );

    const textoValido = "Natación recreativa";
    await input.sendKeys(textoValido);
    await global.driver.sleep(300);

    let valueUI = (await input.getAttribute("value")).trim();
    assert.strictEqual(
      valueUI,
      textoValido,
      "El campo no aceptó texto válido"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
      input
    );

    await input.sendKeys("123");
    await global.driver.sleep(300);

    valueUI = (await input.getAttribute("value")).trim();
    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
      input
    );

    await input.sendKeys("@#%$");
    await global.driver.sleep(300);

    valueUI = (await input.getAttribute("value")).trim();
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