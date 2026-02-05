const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC47 — Validar campo ¿Tuviste alguna enfermedad importante cuando eras niño o niña?", function () {
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
      logger.info("\nEjecutando TC47 — Validar campo ¿Tuviste alguna enfermedad importante cuando eras niño o niña? | 47 de 105\n");
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

    await global.helper.clickNext(3);

    const enfermedadInfanciaSelect = await global.helper.findOrFail(
      "//select[@name='Tuviste_alguna_enfermedad_importante_cuando_eras_ni_o_o_ni_a']",
      "Campo ¿Tuviste alguna enfermedad importante cuando eras niño o niña?"
    );

    const optionEls = await enfermedadInfanciaSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Tuviste alguna enfermedad importante cuando eras niño o niña?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await enfermedadInfanciaSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await enfermedadInfanciaSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await enfermedadInfanciaSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await enfermedadInfanciaSelect.click();
    await opcionNo.click();

    selectedValue = await enfermedadInfanciaSelect.getAttribute("value");

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