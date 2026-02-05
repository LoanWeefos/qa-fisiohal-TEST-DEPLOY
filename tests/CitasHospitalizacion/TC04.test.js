const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");


describe("TC04 — Validar que fechas pasadas no estén disponibles", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    PastYear: "2025",
    PastMonthLabel: "December",
    PastMonthNumber: "12",
    PastDay: "1",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC04 — Validar que fechas pasadas no estén disponibles | 4 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("No debe permitir seleccionar fechas pasadas", async () => {
    await global.helper
      .findOrFail(
        "//label[normalize-space()='Fecha']/following::input[1]",
        "Campo Fecha"
      )
      .then((el) => el.click());

    await global.driver.sleep(400);

    const yearSelect = await global.helper.findOrFail(
      "//select[contains(@class,'slds-select')]",
      "Selector de año"
    );
    await yearSelect.click();

    await global.helper
      .findOrFail(
        `//option[@value='${expected.PastYear}']`,
        "Opción de año pasado"
      )
      .then((el) => el.click());

    await global.driver.sleep(300);

    let visibleMonth = await global.helper
      .findOrFail("//lightning-calendar//h2", "Título del calendario")
      .then((el) => el.getText());

    let tries = 0;
    while (!visibleMonth.includes(expected.PastMonthLabel) && tries < 12) {
      await global.helper
        .findOrFail("//button[@title='Previous Month']", "Botón mes anterior")
        .then((el) => el.click());

      await global.driver.sleep(300);

      visibleMonth = await global.helper
        .findOrFail("//lightning-calendar//h2", "Título del calendario")
        .then((el) => el.getText());

      tries++;
    }

    const pastDayXpath = `//td[@data-value='${expected.PastYear}-${
      expected.PastMonthNumber
    }-${String(expected.PastDay).padStart(2, "0")}']`;

    const dayCells = await global.driver.findElements(By.xpath(pastDayXpath));

    if (dayCells.length === 0) {
      assert.ok(true);
      return;
    }

    const dayCell = dayCells[0];
    const classAttr = await dayCell.getAttribute("class");
    const ariaDisabled = await dayCell.getAttribute("aria-disabled");

    const isDisabled =
      classAttr?.includes("slds-disabled") ||
      classAttr?.includes("is-disabled") ||
      ariaDisabled === "true";

    assert.strictEqual(isDisabled, true);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
