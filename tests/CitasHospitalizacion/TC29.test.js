const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC29 — Validar horarios disponibles por Médico y Terapia", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 1",
    Therapy: "H Cognitiva",
    Day: "17",
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
        "\nEjecutando TC29 — Horarios disponibles Médico + Terapia\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe crear la cita y validarse en calendario y registro", async () => {
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar"
    );

    assert.strictEqual(
      await global.helper.isButtonDisabled(saveBtn),
      false,
      "Guardar está deshabilitado con datos completos."
    );

    await saveBtn.click();

    const toastOk = !!(await global.helper.checkSuccessToast());
    assert.strictEqual(toastOk, true, "No apareció el toast de éxito.");

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher"
    );
    await global.driver.sleep(600);

    const searchInput = await global.helper.findOrFail(
      "//input[@type='search' and contains(@placeholder,'Search apps and items')]",
      "Search"
    );

    await searchInput.clear();
    await searchInput.sendKeys("Calendario FisioHal");
    await global.driver.sleep(700);

    await global.helper.safeFindAndClick(
      "//a[contains(@class,'al-menu-item') and contains(@data-label,'Calendario FisioHal')]",
      "Calendario"
    );

    await global.driver.sleep(4000);
    await global.driver.navigate().refresh();

    await global.driver.wait(
      until.elementLocated(By.xpath("//div[contains(@id,'calendar')]")),
      8000
    );

    const targetDate = `${expected.Year}-12-${String(expected.Day).padStart(
      2,
      "0"
    )}`;

    const nextBtn = await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Next calendario"
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
      "No se encontró la fecha objetivo en el calendario."
    );

    const eventXpath = `//a[contains(@class,'fc-time-grid-event')]
          [.//small[contains(., 'Px:')]]
          [.//small[contains(., 'Tipo:')]]
          [.//small[contains(., '${expected.Therapy}')]]
          [.//small[contains(., 'Territorio:')]]
          [.//small[contains(., '${expected.Area}')]]
        `;

    const events = await global.driver.findElements(By.xpath(eventXpath));
    assert.strictEqual(
      events.length > 0,
      true,
      "No se encontró el evento de la cita en el calendario."
    );
  });

  afterEach(async () => {
    await global.helper.goToAccount(expected.AccountName);
    await global.driver.sleep(1500);
    await global.driver.navigate().refresh();
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and normalize-space()='Citas']",
      "Pestaña Citas"
    );
    await global.driver.sleep(2000);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 0, "No se encontró la cita creada");

    const citaLink = await rows[0].findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      citaLink
    );
    await global.driver.sleep(2500);

    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
