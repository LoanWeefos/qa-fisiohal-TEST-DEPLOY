const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC33 — Crear cita hoy + semanal y validar semana completa", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Area: "Piso 1",
    Therapy: "H Fisica",
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
        "\nEjecutando TC33 — Crear cita hoy + semanal y validar semana completa | 33 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
  });

  it("Debe dejar la semana completa con citas (de hoy a viernes)", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();

    let expectedDays = 0;
    for (let d = todayDay; d <= 5; d++) {
      if (d > 0 && d < 6) expectedDays++;
    }

    assert.ok(expectedDays > 0);

    await global.helper.openCreateForm();

    await global.driver.wait(
      until.elementLocated(By.xpath("//button[@name='Frequency']")),
      15000
    );

    await global.helper.selectFrequency("Del día");
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    let saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    assert.strictEqual(await global.helper.isButtonDisabled(saveBtn), false);

    await saveBtn.click();

    assert.ok(await global.helper.checkSuccessToast());

    await global.driver.sleep(1500);

    await global.helper.openCreateForm();

    await global.driver.wait(
      until.elementLocated(By.xpath("//button[@name='Frequency']")),
      15000
    );

    await global.helper.selectFrequency("Semanal");
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita semanal en el formulario de creación de citas de hospitalización"
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

    await global.driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(@class,'fc-next-button')]")
      ),
      15000
    );

    await global.driver.sleep(800);

    const dayColumns = await global.driver.findElements(
      By.xpath("//div[contains(@class,'fc-content-col')]")
    );

    let daysWithEvent = 0;

    for (const col of dayColumns) {
      const events = await col.findElements(
        By.xpath(`
            .//a[contains(@class,'fc-time-grid-event')]
              [.//small[contains(., '${expected.AccountName}')]]
              [.//small[contains(., '${expected.Therapy}')]]
              [.//small[contains(., '${expected.Area}')]]
          `)
      );

      if (events.length > 0) {
        daysWithEvent++;
      }
    }

    assert.strictEqual(daysWithEvent, expectedDays, `Días con evento - Debería haber eventos desde hoy hasta el viernes (${expectedDays} días), pero se encontraron eventos en ${daysWithEvent} días`);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
