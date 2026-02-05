const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC68 — Validar campo ¿Cuál es?, ¿Quién la tiene o la tuvo?", function () {
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
      logger.info("\nEjecutando TC68 — Validar campo ¿Cuál es?, ¿Quién la tiene o la tuvo? | 68 de 105\n");
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

    const otraEnfermedadSelect = await global.helper.findOrFail(
      "//select[@name='Conoces_alguna_otra_enfermedad_importante_que_se_repita_en_tu_familia']",
      "Campo ¿Conoces alguna otra enfermedad importante que se repita en tu familia?"
    );

    await otraEnfermedadSelect.sendKeys("No");
    await global.driver.sleep(300);

    let detalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Cu_l_es_Qui_n_la_tiene_o_la_tuvo']")
    );

    assert.strictEqual(
      detalleInput.length,
      0,
      "El campo '¿Cuál es?, ¿Quién la tiene o la tuvo?' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await otraEnfermedadSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await otraEnfermedadSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    detalleInput = await global.driver.findElements(
      By.xpath("//input[@name='Cu_l_es_Qui_n_la_tiene_o_la_tuvo']")
    );

    assert.ok(
      detalleInput.length > 0 &&
      (await detalleInput[0].isDisplayed()),
      "El campo '¿Cuál es?, ¿Quién la tiene o la tuvo?' debería mostrarse al seleccionar 'Si'"
    );

    const input = detalleInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Asma en dos hermanos";
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