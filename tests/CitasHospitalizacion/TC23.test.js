const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC23 — Validar frecuencia no válida", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    InvalidFrequency: "INVALIDA",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC23 — Validar frecuencia no válida | 23 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("No debe mostrar ni permitir seleccionar una frecuencia inválida", async () => {
    await global.helper.safeFindAndClick(
      "//button[@name='Frequency']",
      "Menú desplegable Frecuencia"
    );
    await global.driver.sleep(300);

    const invalidOptionXpath = `//lightning-base-combobox-item[.//span[normalize-space()='${expected.InvalidFrequency}']]`;

    const invalidOptions = await global.driver.findElements(
      By.xpath(invalidOptionXpath)
    );

    assert.strictEqual(
      invalidOptions.length,
      0,
      "La frecuencia inválida aparece en el listado."
    );

    const freqBtn = await global.helper.findOrFail(
      "//button[@name='Frequency']",
      "Dropdown Frecuencia"
    );

    const freqValue =
      (await freqBtn.getAttribute("data-value")) ||
      (await freqBtn.getAttribute("value")) ||
      (await freqBtn.getText()) ||
      "";

    assert.strictEqual(
      (freqValue || "").includes(expected.InvalidFrequency),
      false,
      "Se pudo seleccionar la frecuencia inválida."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
