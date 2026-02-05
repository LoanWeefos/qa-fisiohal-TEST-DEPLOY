const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC65 — Validar campo ¿Alguien en tu familia tiene problemas hormonales o de metabolismo?", function () {
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
      logger.info("\nEjecutando TC65 — Validar campo ¿Alguien en tu familia tiene problemas hormonales o de metabolismo? | 65 de 105\n");
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

    const metabolismoSelect = await global.helper.findOrFail(
      "//select[@name='Alguien_en_tu_familia_tiene_problemas_hormonales_o_de_metabolismo_como_diabetes']",
      "Campo ¿Antecedentes familiares hormonales o metabólicos?"
    );

    const optionEls = await metabolismoSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Antecedentes familiares hormonales o metabólicos?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await metabolismoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await metabolismoSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await metabolismoSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await metabolismoSelect.click();
    await opcionNo.click();

    selectedValue = await metabolismoSelect.getAttribute("value");

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