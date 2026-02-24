const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC77 — Validar campo Si está embarazada, ¿se encuentra en las últimas etapas de la gestación y ha notado dificultad para moverse o mantener el equilibrio?", function () {
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
      logger.info("\nEjecutando TC77 — Validar campo Si está embarazada, ¿se encuentra en las últimas etapas de la gestación y ha notado dificultad para moverse o mantener el equilibrio? | 77 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(4);

    const embarazoSelect = await global.helper.findOrFail(
      "//select[@name='Si_est_embarazada_se_encuentra_en_las_ltimas_etapas_de_la_gestaci_n_y_ha_notado']",
      "Campo embarazo y equilibrio - No se encuentra en el formulario"
    );

    const optionEls = await embarazoSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en embarazo y equilibrio\nUI: ${JSON.stringify(uiOptions)}`
    );

    await embarazoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await embarazoSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await embarazoSelect.findElement(
      By.xpath(".//option[@value='No']")
    );
    await embarazoSelect.click();
    await opcionNo.click();

    selectedValue = await embarazoSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "No",
      "No se pudo seleccionar la opción 'No'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});