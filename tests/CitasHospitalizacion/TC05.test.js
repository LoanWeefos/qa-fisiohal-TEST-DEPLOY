const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC05 — Áreas Hospitalización lista completa", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
  };

  const expectedAreas = [
    "PISO 1",
    "PISO 2",
    "PISO 3",
    "PISO 4",
    "PISO 5",
    "PISO 6",
    "URG",
    "UTIN",
    "UCC",
    "COVID",
    "ONCO",
    "UTI",
    "CPM",
    "UCIN",
    "COE",
  ];

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC05 — Áreas Hospitalización lista completa | 5 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe encontrar cada área al buscarla", async () => {
    const input = await global.helper.findOrFail(
      "//input[@role='combobox' and @aria-label='Área de Atención']",
      "Campo Área de Atención"
    );

    const faltantes = [];

    await global.helper.safeFindAndClick(
      "//button[@data-clear-selection-button and contains(@title,'Área de Atención')]"
    );

    for (const area of expectedAreas) {
      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        input
      );
      await global.driver.executeScript("arguments[0].click();", input);

      await global.driver.executeScript(
        "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input')); arguments[0].dispatchEvent(new Event('change'));",
        input
      );

      await global.driver.sleep(300);

      await input.sendKeys(area);
      await global.driver.sleep(700);

      const results = await global.driver.findElements(
        By.xpath("//lightning-base-combobox-item[@role='option']")
      );

      let found = false;

      for (const r of results) {
        const text =
          (await r.getAttribute("title")) || (await r.getText()) || "";

        if (text.trim().toUpperCase().includes(area)) {
          found = true;
          break;
        }
      }

      if (!found) {
        faltantes.push(area);
        console.error(`Área no encontrada: ${area}`);
      } else {
        console.log(`Área encontrada: ${area}`);
      }

      await global.driver.actions().sendKeys("\uE00C").perform();
      await global.driver.sleep(300);
    }

    assert.strictEqual(
      faltantes.length,
      0,
      `Áreas faltantes:\n- ${faltantes.join("\n- ")}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
