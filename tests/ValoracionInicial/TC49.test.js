const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC49 — Validar campo ¿Alguna vez te han hecho una transfusión de sangre?", function () {
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
      logger.info("\nEjecutando TC49 — Validar campo ¿Alguna vez te han hecho una transfusión de sangre? | 49 de 105\n");
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

    const transfusionSelect = await global.helper.findOrFail(
      "//select[@name='Alguna_vez_te_han_hecho_una_transfusi_n_de_sangre']",
      "Campo ¿Alguna vez te han hecho una transfusión de sangre?"
    );

    const optionEls = await transfusionSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Alguna vez te han hecho una transfusión de sangre?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await transfusionSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await transfusionSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await transfusionSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await transfusionSelect.click();
    await opcionNo.click();

    selectedValue = await transfusionSelect.getAttribute("value");

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