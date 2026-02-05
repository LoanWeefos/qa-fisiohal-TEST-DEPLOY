const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC88 — Validar campo Tiene alguna limitación al movimiento", function () {
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
      logger.info("\nEjecutando TC88 — Validar campo Tiene alguna limitación al movimiento | 88 de 105\n");
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

    const limitacionSelect = await global.helper.findOrFail(
      "//select[@name='Tiene_alguna_limitaci_n_al_movimiento']",
      "Campo ¿Tiene alguna limitación al movimiento?"
    );

    const optionEls = await limitacionSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Tiene alguna limitación al movimiento?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await limitacionSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await limitacionSelect.getAttribute("value");

    assert.ok(
      selectedValue,
      "No se pudo seleccionar la opción 'Si'"
    );

    await limitacionSelect.sendKeys("No");
    await global.driver.sleep(300);

    selectedValue = await limitacionSelect.getAttribute("value");

    assert.ok(
      selectedValue,
      "No se pudo seleccionar la opción 'No'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});