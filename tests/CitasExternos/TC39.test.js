const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC39 — Validar cita no disponible con mismos datos", function () {
  this.timeout(0);

  let slotBookedText;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC39 — Validar cita no disponible con mismos datos | 39 de 50\n"
      );
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe ocultar el horario ya agendado al intentar crear una cita con los mismos datos", async () => {
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

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas - Debe existir una tabla con terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila de terapeuta Cecilia Ramirez - Debe existir una fila en la tabla de terapeutas con el nombre 'Cecilia Ramirez'"
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
      "Boton Today - Debe existir el botón 'Today' en el calendario"
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

    assert.ok(columns.length >= 2, "No hay suficientes columnas con horarios");

    const targetColumn = columns[1];

    const slotsBefore = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    assert.ok(slotsBefore.length > 0, "No hay horarios disponibles");

    const lastSlot = slotsBefore[slotsBefore.length - 1];
    slotBookedText = (await lastSlot.getText()).trim();

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      lastSlot
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Finish']",
      "Boton Finish - Debe existir el botón 'Finish' para confirmar la agenda de la cita"
    );
    await global.driver.sleep(3000);

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
    await global.driver.sleep(1500);

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

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCeciliaAgain = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila de terapeuta Cecilia Ramirez - Debe existir una fila en la tabla de terapeutas con el nombre 'Cecilia Ramirez'"
    );

    const therapistRadioAgain = await rowCeciliaAgain.findElement(
      By.xpath(".//input[@type='radio']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistRadioAgain
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today - Debe existir el botón 'Today' en el calendario"
    );
    await global.driver.sleep(1200);

    let columnsAgain = [];
    const startAgain = Date.now();
    while (columnsAgain.length < 2 && Date.now() - startAgain < 25000) {
      columnsAgain = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columnsAgain.length < 2) await global.driver.sleep(300);
    }

    assert.ok(
      columnsAgain.length >= 2,
      "No hay suficientes columnas con horarios"
    );

    const targetColumnAgain = columnsAgain[1];

    const remainingSlots = await targetColumnAgain.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    const remainingTexts = [];
    for (const slot of remainingSlots) {
      remainingTexts.push((await slot.getText()).trim());
    }

    await global.driver.navigate().refresh();
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir la pestaña 'Citas' en la página de cuenta"
    );
    await global.driver.sleep(2500);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 0, "No hay citas para eliminar");

    const firstRow = rows[0];
    const citaLink = await firstRow.findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      citaLink
    );
    await global.driver.sleep(3000);

    await global.helper.safeFindAndClick(
      "(//button[@name='Delete'])[2]",
      "Botón Delete - Debe existir un botón 'Delete' para eliminar la cita creada"
    );

    await global.helper.safeFindAndClick(
      "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
      "Confirmar Delete - Debe existir un botón para confirmar la eliminación de la cita"
    );

    await global.driver.sleep(2000);

    assert.strictEqual(
      remainingTexts.includes(slotBookedText),
      false,
      `El horario ${slotBookedText} sigue disponible aunque ya fue agendado`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
