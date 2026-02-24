const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC34 — Validar horarios disponibles por Territorios de servicio vs terapias asignadas", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 1",
    Therapy: "H Terapia Media Fisica",
    Day: "22",
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
        "\nEjecutando Validar horarios disponibles por Territorios de servicio vs terapias asignadas | 34 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe crear la cita y visualizarla en el calendario", async () => {
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
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    assert.strictEqual(await global.helper.isButtonDisabled(saveBtn), false);

    await saveBtn.click();

    assert.ok(
      await global.helper.checkSuccessToast(),
      "No apareció toast de éxito en cita semanal"
    );

    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher - Debe existir un botón para abrir el App Launcher en la barra de navegación"
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
      "Calendario - Debe existir una opción para acceder al Calendario FisioHal en el App Launcher"
    );

    await global.driver.sleep(4000);
    await global.driver.navigate().refresh();

    await global.driver.wait(
      until.elementLocated(By.xpath("//div[contains(@id,'calendar')]")),
      15000
    );

    const nextBtn = await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Botón Next calendario - Debe existir un botón para avanzar al siguiente periodo en el calendario"
    );

    await global.driver.sleep(800);

    const targetDate = `${expected.Year}-12-${String(expected.Day).padStart(
      2,
      "0"
    )}`;

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

    assert.strictEqual(dateVisible, true);

    const eventXpath = `//a[contains(@class,'fc-time-grid-event')]
        [.//small[contains(., 'Px:')]]
        [.//small[contains(., 'Tipo:')]]
        [.//small[contains(., '${expected.Therapy}')]]
        [.//small[contains(., 'Territorio:')]]
        [.//small[contains(., '${expected.Area}')]]
      `;

    const events = await global.driver.findElements(By.xpath(eventXpath));

    assert.strictEqual(events.length > 0, true, "No se encontró la cita en el calendario");
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
