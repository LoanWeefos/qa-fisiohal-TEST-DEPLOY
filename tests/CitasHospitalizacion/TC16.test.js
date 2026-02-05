const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC16 — Validar cita agendada en calendario", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Area: "Piso 1",
    Therapy: "H Fisica",
    Day: "29",
    MonthLabel: "December",
    Year: "2026",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC16 — Validar cita agendada en calendario | 16 de 36\n"
      );
    }

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher"
    );
    await global.driver.sleep(600);

    const searchInput = await global.helper.findOrFail(
      "//input[@type='search' and contains(@placeholder,'Search apps and items')]",
      "Search",
      60000
    );

    await searchInput.clear();
    await searchInput.sendKeys("Calendario FisioHal");
    await global.driver.sleep(700);

    await global.helper.safeFindAndClick(
      "//a[contains(@class,'al-menu-item') and contains(@data-label,'Calendario FisioHal')]",
      "Calendario"
    );
    await global.driver.sleep(3000);
    await global.driver.navigate().refresh();

    await global.driver.wait(
      until.elementLocated(By.xpath("//div[contains(@id,'calendar')]")),
      10000
    );
  });

  it("Debe mostrar la cita existente en el calendario", async () => {
    const monthNumber = expected.MonthLabel === "December" ? "12" : "01";
    const targetDate = `${expected.Year}-${monthNumber}-${expected.Day}`;

    const nextBtn = await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Botón Next del calendario"
    );

    let dateVisible = false;

    for (let i = 0; i < 52; i++) {
      const cell = await global.driver.findElements(
        By.xpath(`//th[@data-date='${targetDate}']`)
      );

      if (cell.length > 0) {
        dateVisible = true;
        break;
      }

      await nextBtn.click();
      await global.driver.sleep(900);
    }

    assert.strictEqual(
      dateVisible,
      true,
      `No se encontró la fecha ${expected.Day} de ${expected.MonthLabel} de ${expected.Year} en el calendario.`
    );

    const eventXpath = `
      //a[contains(@class,'fc-time-grid-event')]
        [.//small[contains(., '${expected.Therapy}')]]
        [.//small[contains(., '${expected.Area}')]]
    `;

    const events = await global.driver.findElements(By.xpath(eventXpath));

    assert.strictEqual(
      events.length > 0,
      true,
      `La cita con Área '${expected.Area}' y Terapia '${expected.Therapy}' no se visualiza en el calendario.`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
