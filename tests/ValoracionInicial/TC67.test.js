const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC67 — Validar campo ¿Conoces alguna otra enfermedad importante que se repita en tu familia?", function () {
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
      logger.info("\nEjecutando TC67 — Validar campo ¿Conoces alguna otra enfermedad importante que se repita en tu familia? | 67 de 105\n");
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

    const repetitivaSelect = await global.helper.findOrFail(
      "//select[@name='Conoces_alguna_otra_enfermedad_importante_que_se_repita_en_tu_familia']",
      "Campo ¿Conoces alguna otra enfermedad importante que se repita en tu familia?"
    );

    const optionEls = await repetitivaSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Conoces alguna otra enfermedad importante que se repita en tu familia?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await repetitivaSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await repetitivaSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await repetitivaSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await repetitivaSelect.click();
    await opcionNo.click();

    selectedValue = await repetitivaSelect.getAttribute("value");

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