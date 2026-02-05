const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC92 — Validar campo Afectaciones en calidad de vida", function () {
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
      logger.info("\nEjecutando TC92 — Validar campo Afectaciones en calidad de vida | 92 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(5);

    const calidadSelect = await global.helper.findOrFail(
      "//select[@name='Esta_condici_n_a_afectado_su_calidad_de_vida']",
      "Campo Calidad de Vida"
    );

    await calidadSelect.sendKeys("Si");
    await global.driver.sleep(500);

    const input = await global.helper.findOrFail(
      "//input[@name='Afectaciones_en_calidad_de_vida']",
      "Campo Afectaciones en calidad de vida"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
      input
    );

    const textoValido = "Dolor al permanecer de pie por tiempos prolongados";
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

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});