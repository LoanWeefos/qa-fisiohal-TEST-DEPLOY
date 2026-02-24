const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

function normalizeTo24h(text) {
  text = text.toLowerCase().trim();

  let m = text.match(/(\d{1,2}):(\d{2})/);
  if (!text.includes("a.m.") && !text.includes("p.m.") && m) {
    return `${m[1].padStart(2, "0")}:${m[2]}`;
  }

  m = text.match(/(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/);
  if (!m) return null;

  let hour = parseInt(m[1], 10);
  const min = m[2];
  const period = m[3];

  if (period === "p.m." && hour !== 12) hour += 12;
  if (period === "a.m." && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${min}`;
}

describe("TC41 — Validar información mostrada tras elegir horario", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC41 — Validar información mostrada tras elegir horario | 41 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar correctamente la información de la cita seleccionada", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir una opción de terapia llamada 'E Drenaje Linfatico' en la página de agenda cita"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Opción Cubiculo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila Cecilia Ramirez - Debe existir una fila con el nombre 'Cecilia Ramirez' en la tabla de terapeutas"
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
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today - Debe existir el botón 'Today' para seleccionar la fecha actual en el calendario de selección de horario"
    );
    await global.driver.sleep(1200);

    let columns = [];
    const start = Date.now();
    while (columns.length < 2 && Date.now() - start < 25000) {
      columns = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columns.length < 2) await global.driver.sleep(300);
    }

    assert.ok(columns.length >= 2);

    const targetColumn = columns[1];

    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    assert.ok(slots.length > 0);

    const lastSlot = slots[slots.length - 1];

    const slotContainer = await lastSlot.findElement(
      By.xpath(
        "ancestor::label | ancestor::span[contains(@class,'slds-radio')]"
      )
    );

    const slotText = (await slotContainer.getText()).toLowerCase().trim();

    const match = slotText.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);

    assert.ok(match);

    const expectedStart = match[1];
    const expectedEnd = match[2];

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      lastSlot
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    const workType = await global.driver.wait(
      until.elementLocated(By.xpath("//*[text()='E Drenaje Linfatico']")),
      10000
    );
    assert.ok(await workType.isDisplayed());

    const patient = await global.helper.findOrFail(
      "//*[text()='TEST TEST']",
      "Paciente - Debe mostrarse el nombre del paciente 'TEST TEST' en el resumen de la cita"
    );

    assert.strictEqual(await patient.getText(), "TEST TEST");

    const startDateElement = await global.helper.findOrFail(
      "//span[normalize-space()='Scheduled Start (America/Mexico_City)']" +
        "/ancestor::div[contains(@class,'slds-form-element')]" +
        "//lightning-formatted-date-time",
      "Fecha de inicio - Debe mostrarse la fecha y hora de inicio de la cita en el resumen de la cita"
    );
    const startText = (await startDateElement.getText()).toLowerCase();

    const endDateElement = await global.helper.findOrFail(
      "//span[normalize-space()='Scheduled End (America/Mexico_City)']" +
        "/ancestor::div[contains(@class,'slds-form-element')]" +
        "//lightning-formatted-date-time",
      "Fecha de fin - Debe mostrarse la fecha y hora de fin de la cita en el resumen de la cita"
    );
    const endText = (await endDateElement.getText()).toLowerCase();

    const expectedStart24 = normalizeTo24h(expectedStart);
    const expectedEnd24 = normalizeTo24h(expectedEnd);

    const start24 = normalizeTo24h(startText);
    const end24 = normalizeTo24h(endText);

    console.log(start24, end24);

    assert.strictEqual(
      start24,
      expectedStart24,
      "Hora de inicio no coincide con el horario seleccionado"
    );

    assert.strictEqual(
      end24,
      expectedEnd24,
      "Hora de fin no coincide con el horario seleccionado"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
