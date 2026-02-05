const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC33 — Validar no permitir seleccionar fecha pasada", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC33 — Validar no permitir seleccionar fecha pasada | 33 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("No debe permitir agendar cita en una fecha pasada y todos los días deben quedar sin horarios", async () => {
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
      "//span[contains(@class,'slds-text-heading_medium') and normalize-space()='Cubiculo B']",
      "Opción Cubiculo B"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla de terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//th[@data-label='Service Resource Name']//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila terapeuta Cecilia Ramirez"
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
      "Boton Next"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//input[@name='date']",
      "Input Fecha"
    );
    await global.driver.sleep(600);

    const pastDay = await global.helper.findOrFail(
      "//td[@aria-disabled='true']//span[@class='slds-day' and @role='button']",
      "Día pasado"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      pastDay
    );
    await global.driver.sleep(2000);

    await global.helper.findOrFail(
      "//div[contains(@class,'noTimeSlots')]",
      "Tabla de horarios sin disponibilidad",
      20000
    );

    const emptyDays = await global.driver.findElements(
      By.xpath("//div[contains(@class,'noTimeSlots')]")
    );

    assert.strictEqual(
      emptyDays.length > 0,
      true,
      "No se encontraron días sin disponibilidad al seleccionar una fecha pasada"
    );

    for (const day of emptyDays) {
      const msg = await day.findElement(By.xpath(".//p")).getText();
      assert.strictEqual(
        msg.toLowerCase().includes("no availability"),
        true,
        `Se encontró disponibilidad cuando no debería existir: ${msg}`
      );
    }
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
