const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC72 — Validar campo ¿Está tomando algún medicamento que le cause somnolencia, mareos o debilidad?", function () {
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
      logger.info("\nEjecutando TC72 — Validar campo ¿Está tomando algún medicamento que le cause somnolencia, mareos o debilidad? | 72 de 105\n");
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

    await global.helper.clickNext(4);

    const medicamentoSelect = await global.helper.findOrFail(
      "//select[@name='Est_tomando_alg_n_medicamento_que_le_cause_somnolencia_mareos_o_debilidad']",
      "Campo medicamento con efectos secundarios"
    );

    const optionEls = await medicamentoSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en medicamento con efectos secundarios\nUI: ${JSON.stringify(uiOptions)}`
    );

    await medicamentoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await medicamentoSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await medicamentoSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await medicamentoSelect.click();
    await opcionNo.click();

    selectedValue = await medicamentoSelect.getAttribute("value");

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