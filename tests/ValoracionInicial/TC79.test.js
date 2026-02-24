const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC79 — Validar campo ¿Ha pasado largos periodos sin comer, sintiendo debilidad o mareo al ponerse de pie?", function () {
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
      logger.info("\nEjecutando TC79 — Validar campo ¿Ha pasado largos periodos sin comer, sintiendo debilidad o mareo al ponerse de pie? | 79 de 105\n");
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

    const mareoSelect = await global.helper.findOrFail(
      "//select[@name='Ha_notado_que_al_levantarse_r_pidamente_de_una_silla_o_cama_siente_mareo_o_aturd']",
      "Campo mareo al levantarse - No se encuentra en el formulario"
    );

    const optionEls = await mareoSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en mareo al levantarse\nUI: ${JSON.stringify(uiOptions)}`
    );

    await mareoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await mareoSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await mareoSelect.findElement(
      By.xpath(".//option[@value='No']")
    );
    await mareoSelect.click();
    await opcionNo.click();

    selectedValue = await mareoSelect.getAttribute("value");
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