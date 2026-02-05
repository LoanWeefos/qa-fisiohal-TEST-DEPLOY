const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC37 — Pasar Select Time Slot (mínimos obligatorios)", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC37 — Pasar Select Time Slot | 37 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe avanzar a Select Group Appointment Details al seleccionar una hora", async () => {
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

    await global.helper.findOrFail(
      "//span[contains(@class,'slds-radio_faux')]",
      "Opciones de horario",
      20000
    );

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//th[@data-label='Service Resource Name']//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
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
      "Boton Next"
    );
    await global.driver.sleep(2000);

    await global.helper.findOrFail(
      "//span[contains(@class,'slds-radio_faux')]",
      "Opciones de horario",
      20000
    );

    const firstSlot = await global.helper.findOrFail(
      "(//span[contains(@class,'slds-radio_faux')])[1]",
      "Primera opción de horario"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      firstSlot
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1500);

    const activeStep = await (
      await global.helper.findOrFail(
        "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
        "Título de etapa activa"
      )
    ).getText();

    assert.strictEqual(
      activeStep.toLowerCase().includes("review"),
      true,
      "No avanzó a Review después de seleccionar la hora"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
