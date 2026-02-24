const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC31 — Agendamiento semanal", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Semanal",
    Area: "Piso 1",
    Therapy: "H Neurorehabilitacion",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC31 — Agendamiento semanal | 31 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe agendar citas desde hoy hasta el fin de la semana", async () => {
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    assert.strictEqual(
      await global.helper.isButtonDisabled(saveBtn),
      false,
      "Guardar está deshabilitado con datos completos"
    );

    await saveBtn.click();

    assert.ok(
      await global.helper.checkSuccessToast(),
      "No apareció toast de éxito al guardar agendamiento semanal"
    );

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher - Debe existir un botón para abrir el App Launcher desde el cual acceder al calendario"
    );
    await global.driver.sleep(600);

    const searchInput = await global.helper.findOrFail(
      "//input[@type='search' and contains(@placeholder,'Search apps and items')]",
      "Search - Debe existir un campo de búsqueda para buscar apps y objetos en el App Launcher"
    );

    await searchInput.clear();
    await searchInput.sendKeys("Calendario FisioHal");
    await global.driver.sleep(700);

    await global.helper.safeFindAndClick(
      "//a[contains(@class,'al-menu-item') and contains(@data-label,'Calendario FisioHal')]",
      "Calendario FisioHal - Debe existir una opción para acceder al Calendario FisioHal desde el App Launcher"
    );

    await global.driver.sleep(4000);
    await global.driver.navigate().refresh();

    await global.driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(@class,'fc-next-button')]")
      ),
      15000
    );

    await global.driver.sleep(1000);

    const eventXpath = `
      //a[contains(@class,'fc-time-grid-event')]
        [.//small[contains(., '${expected.Therapy}')]]
        [.//small[contains(., '${expected.Area}')]]
    `;

    await global.driver.wait(
      async () =>
        (await global.driver.findElements(By.xpath(eventXpath))).length > 0,
      15000
    );

    const dayColumns = await global.driver.findElements(
      By.xpath("//div[contains(@class,'fc-content-col')]")
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();

    let expectedDays = 0;
    for (let d = todayDay; d <= 5; d++) {
      if (d > 0 && d < 6) expectedDays++;
    }

    assert.ok(expectedDays > 0);

    let daysWithEvent = 0;

    for (const col of dayColumns) {
      const eventsInCol = await col.findElements(
        By.xpath(`
          .//a[contains(@class,'fc-time-grid-event')]
            [.//small[contains(., '${expected.Therapy}')]]
            [.//small[contains(., '${expected.Area}')]]
        `)
      );

      if (eventsInCol.length > 0) {
        daysWithEvent++;
      }
    }

    assert.ok(daysWithEvent >= expectedDays, `Se esperaban al menos ${expectedDays} días con evento, pero se encontraron ${daysWithEvent}`);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
