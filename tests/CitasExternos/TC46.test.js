const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC46 — Validar datos de cita desde registro", function () {
  this.timeout(0);

  let selectedSlotText;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC46 — Validar datos de cita desde registro | 46 de 50\n"
      );
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe validar la información mostrada dentro de la cita y permitir eliminarla", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Opción Cubiculo B"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]"
    );

    const therapistRadio = await rowCecilia.findElement(
      By.xpath(".//input[@type='radio']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistRadio
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today"
    );
    await global.driver.sleep(1200);

    let columns = [];
    const start = Date.now();
    while (columns.length < 3 && Date.now() - start < 25000) {
      columns = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columns.length < 3) await global.driver.sleep(300);
    }

    const targetColumn = columns[2];
    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    const lastSlot = slots[slots.length - 1];
    selectedSlotText = (await lastSlot.getText()).trim();

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      lastSlot
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(2000);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(2000);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(2000);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Finish']",
      "Boton Finish"
    );
    await global.driver.sleep(3000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas"
    );
    await global.driver.sleep(2500);
    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    const firstRow = rows[0];
    const citaLink = await firstRow.findElement(
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

    const accountUI = await spansAccount[2].getText();

    const spansWorkType = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordTipo_de_Cita_cField']//a//span"
      )
    );
    const workTypeUI = (await spansWorkType.at(-1).getText()).trim();

    const spansTherapist = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordTerapeuta_Asignado_Resource_cField']//a//span"
      )
    );
    const therapistUI = (await spansTherapist.at(-1).getText()).trim();

    const startDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordStartDateField']" +
          "//lightning-formatted-text",
        "Fecha de inicio"
      )
      .then((e) => e.getText());

    const endDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordEndDateField']" +
          "//lightning-formatted-text",
        "Fecha de fin"
      )
      .then((e) => e.getText());

    const spansTerritory = await global.driver.findElements(
      By.xpath(
        "//flexipage-field[@data-field-id='RecordServiceTerritoryIdField']//a//span"
      )
    );
    const territoryUI = (await spansTerritory.at(-1).getText()).trim();

    console.log(
      accountUI,
      workTypeUI,
      therapistUI,
      territoryUI,
      startDateUI,
      endDateUI
    );

    await global.helper.safeFindAndClick(
      "(//button[@name='Delete'])[2]",
      "Boton Delete"
    );

    await global.helper.safeFindAndClick(
      "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
      "Boton Delete"
    );

    assert.ok(accountUI.includes("TEST TEST"));
    assert.ok(workTypeUI.includes("E Drenaje Linfatico"));
    assert.ok(therapistUI.includes("Cecilia"));

    const [startTime, endTime] = selectedSlotText.split(" - ");
    assert.ok(startDateUI.includes(startTime));
    assert.ok(endDateUI.includes(endTime));

    const territorioNorm = territoryUI
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    assert.ok(
      territorioNorm.includes("cubiculo b"),
      `Service Territory esperado "Cubiculo B", encontrado: "${territoryUI}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
