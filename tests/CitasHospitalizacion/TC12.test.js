const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC12 — Crear cita con datos completos y validar evento en calendario y Work Order", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
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
        "\nEjecutando TC12 — Crear cita con datos completos y validar | 12 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe crear la cita, mostrarse en calendario y existir en Work Orders", async () => {
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
    assert.strictEqual(
      toastOk,
      true,
      "No apareció el toast de éxito al guardar."
    );

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
      8000
    );

    const targetDate = `${expected.Year}-${
      expected.MonthLabel === "December" ? "12" : "01"
    }-${expected.Day}`;

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

    await global.helper.goToAccount(expected.AccountName);
    await global.driver.sleep(2000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas"
    );
    await global.driver.sleep(2500);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 0, "No se encontró ninguna cita creada");

    const citaLink = await rows[0].findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      citaLink
    );
    await global.driver.sleep(3000);

    const spansAccount = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordAccountIdField']//a//span"
      )
    );
    const accountUI = (await spansAccount.at(-1).getText()).trim();

    const spansWorkType = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordTipo_de_Cita_cField']//a//span"
      )
    );
    const workTypeUI = (await spansWorkType.at(-1).getText()).trim();

    const spansTerritory = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordServiceTerritoryIdField']//a//span"
      )
    );
    const territoryUI = (await spansTerritory.at(-1).getText()).trim();

    const startDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordStartDateField']//lightning-formatted-text",
        "Fecha inicio"
      )
      .then((e) => e.getText());

    const endDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordEndDateField']//lightning-formatted-text",
        "Fecha fin"
      )
      .then((e) => e.getText());

    assert.ok(accountUI.includes(expected.AccountName));
    assert.ok(workTypeUI.includes(expected.Therapy));

    const territoryNorm = territoryUI.toLowerCase();
    assert.ok(
      territoryNorm.includes(expected.Area.toLowerCase()),
      `Área esperada "${expected.Area}", encontrada "${territoryUI}"`
    );

    await global.helper.safeFindAndClick(
      "(//button[@name='Delete'])[1]",
      "Botón Delete"
    );

    await global.helper.safeFindAndClick(
      "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
      "Confirmar Delete"
    );

    const expectedDate = `${expected.Day}/12/${expected.Year}`;

    console.log(startDateUI, endDateUI);
    assert.ok(startDateUI.includes(expectedDate));
    assert.ok(endDateUI.includes(expectedDate));
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
