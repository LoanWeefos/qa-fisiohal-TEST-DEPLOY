const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC38 — Botón Today reinicia calendario", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC38 — Botón Today reinicia calendario | 38 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe regresar el calendario al día actual al presionar Today", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir la opción de terapia 'E Drenaje Linfatico' en el step Select Topic"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-text-heading_medium') and normalize-space()='Cubiculo B']",
      "Opción Cubiculo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla de terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//th[@data-label='Service Resource Name']//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila terapeuta Cecilia Ramirez - Debe existir una fila en la tabla de terapeutas con el nombre 'Cecilia Ramirez'"
    );

    const radio = await rowCecilia.findElement(
      By.xpath(".//input[@type='radio']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      radio
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//input[@name='date']",
      "Input Fecha - Debe existir un input para seleccionar la fecha de la cita"
    );
    await global.driver.sleep(600);

    const anyDay = await global.helper.findOrFail(
      "//td[@aria-disabled='true']//span[@class='slds-day' and @role='button']", "Botón día - Debe existir al menos un día en el calendario"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      anyDay
    );
    await global.driver.sleep(1500);

    const calendarBefore = await (
      await global.helper.findOrFail(
        "//div[contains(@class,'mobileTimeSlot')]",
        "Calendario - Debe existir el calendario de selección de horario"
      )
    ).getAttribute("aria-label");

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today - Debe existir el botón 'Today' en el calendario"
    );
    await global.driver.sleep(2000);

    const calendarAfter = await (
      await global.helper.findOrFail(
        "//div[contains(@class,'mobileTimeSlot')]",
        "Calendario - Debe existir el calendario de selección de horario"
      )
    ).getAttribute("aria-label");

    assert.strictEqual(
      calendarBefore !== calendarAfter,
      true,
      "El calendario no cambió al presionar Today"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
