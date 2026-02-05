const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC36 — Validar selección de 2 horas de citas", function () {
  this.timeout(0);

  let driver, helper;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC36 — Validar selección de 2 horas de citas | 36 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe deseleccionar la primera cita al seleccionar la segunda", async () => {
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

    const firstSlotLabel = await global.helper.findOrFail(
      "(//span[contains(@class,'slds-radio_faux')])[1]",
      "Primera opción de horario"
    );

    const secondSlotLabel = await global.helper.findOrFail(
      "(//span[contains(@class,'slds-radio_faux')])[2]",
      "Segunda opción de horario"
    );

    const firstRadio = await global.helper.findOrFail(
      "(//input[@type='radio' and contains(@name,'timeSlotSelected')])[1]",
      "Primera cita"
    );

    const secondRadio = await global.helper.findOrFail(
      "(//input[@type='radio' and contains(@name,'timeSlotSelected')])[2]",
      "Segunda cita"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      firstSlotLabel
    );
    await global.driver.sleep(600);

    assert.strictEqual(
      await firstRadio.isSelected(),
      true,
      "La primera cita no quedó seleccionada"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      secondSlotLabel
    );
    await global.driver.sleep(600);

    assert.strictEqual(
      await secondRadio.isSelected(),
      true,
      "La segunda cita no quedó seleccionada"
    );

    assert.strictEqual(
      await firstRadio.isSelected(),
      false,
      "La primera cita no se deseleccionó al seleccionar la segunda"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
