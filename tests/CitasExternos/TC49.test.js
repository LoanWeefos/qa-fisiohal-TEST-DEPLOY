const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC49 — Validar que no se agende cita sin finalizar flujo", function () {
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
      logger.info("\nEjecutando TC49 — Validar que no se agende cita sin finalizar flujo | 49 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Botón Agenda Cita"
    );
  });

  it("No debe crear la cita si se cierra el formulario antes de Confirmation", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Botón Next"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[contains(text(),'E Drenaje Linfatico')]",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Botón Next"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Opción Cubiculo B"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Botón Next"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila terapeuta Cecilia Ramirez"
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
      "Botón Next"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Botón Today"
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

    const lastSlot = slots.at(-1);
    selectedSlotText = (await lastSlot.getText()).trim();

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      lastSlot
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Botón Next"
    );
    await global.driver.sleep(1500);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Botón Next"
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[@title='Cancel and close']",
      "Botón Cancel and close"
    );
    await global.driver.sleep(3000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(4000);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas"
    );
    await global.driver.sleep(2500);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 0, "No hay citas previas para validar");

    const firstRow = rows[0];
    const citaLink = await firstRow.findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' }); arguments[0].click();",
      citaLink
    );
    await global.driver.sleep(3000);

    const startDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordStartDateField']//lightning-formatted-text",
        "Fecha de inicio"
      )
      .then((e) => e.getText());

    const endDateUI = await global.helper
      .findOrFail(
        "//flexipage-field[@data-field-id='RecordEndDateField']//lightning-formatted-text",
        "Fecha de fin"
      )
      .then((e) => e.getText());

    const [startTime, endTime] = selectedSlotText.split(" - ");

    console.log(startTime, endTime, startDateUI, endDateUI);
    assert.ok(
      !startDateUI.includes(startTime),
      `La cita se creó con hora ${startTime} cuando no debía`
    );

    assert.ok(
      !endDateUI.includes(endTime),
      `La cita se creó con hora ${endTime} cuando no debía`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
