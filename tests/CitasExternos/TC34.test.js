const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC34 — Validar cambio de zona horaria", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC34 — Validar cambio de zona horaria | 34 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe actualizar las horas del calendario al cambiar zona horaria a GMT-07", async () => {
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
    await global.driver.sleep(2500);

    await global.helper.findOrFail(
      "//div[contains(@class,'slds-radio_button-group')]//span[@class='slds-radio_faux']",
      "Opciones de horario - Debe existir opciones de horario para el terapeuta seleccionado",
      20000
    );

    const firstSlotBefore = await (
      await global.helper.findOrFail(
        "(//div[contains(@class,'slds-radio_button-group')]//span[@class='slds-radio_faux'])[1]", "Opción de horario 1 - Debe existir una opción de horario para el terapeuta seleccionado"
      )
    ).getText();

    await global.helper.safeFindAndClick(
      "//button[@name='timezone' and @role='combobox']",
      "Boton Timezone - Debe existir un botón para seleccionar la zona horaria"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item[@data-value='America/Hermosillo']//span[contains(@title,'(GMT-07:00) Mexican Pacific Standard Time (America/Hermosillo)')]",
      "Opción GMT-07 en zona horaria - Debe existir la opción de zona horaria en el selector de zona horaria"
    );
    await global.driver.sleep(2500);

    await global.helper.findOrFail(
      "//div[contains(@class,'slds-radio_button-group')]//span[@class='slds-radio_faux']",
      "Opciones de horario - Debe existir opciones de horario para el terapeuta seleccionado después de cambiar la zona horaria",
      20000
    );

    const firstSlotAfter = await (
      await global.helper.findOrFail(
        "(//div[contains(@class,'slds-radio_button-group')]//span[@class='slds-radio_faux'])[1]", "Opción de horario 1 - Debe existir una opción de horario para el terapeuta seleccionado después de cambiar la zona horaria"
      )
    ).getText();

    const getStartHour = (txt) => parseInt(txt.split(":")[0], 10);

    const beforeHour = getStartHour(firstSlotBefore.trim());
    const afterHour = getStartHour(firstSlotAfter.trim());

    assert.strictEqual(
      afterHour === beforeHour - 1,
      true,
      `Las horas no se ajustaron correctamente al cambiar a GMT-07. Antes: "${firstSlotBefore}" Después: "${firstSlotAfter}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
