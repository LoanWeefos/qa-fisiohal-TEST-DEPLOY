const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC48 — Validar marca Cita empalmada", function () {
  this.timeout(0);

  const patientName = "TEST TEST";
  let selectedSlotIndex = null;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC48 — Validar marca Cita empalmada | 48 de 50\n"
      );
    }

    await global.helper.goToAccount(patientName);
  });

  it("Agenda correctamente la cita a la misma hora", async () => {
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[contains(text(),'E ATM')]",
      "Opción terapia E ATM - Debe existir una opción de terapia llamada 'E ATM' en la página de agenda cita"
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

    const therapistCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[contains(text(),'Cecilia')]]//input[@type='radio']",
      "Terapeuta Cecilia - Debe existir una fila con el nombre 'Cecilia Ramirez' en la tabla de terapeutas y un radio button para seleccionarla"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistCecilia
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today - Debe existir el botón 'Today' en la página de agenda cita"
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

    assert.ok(columns.length >= 2, "No se encontraron columnas de horarios");

    const targetColumn = columns[1];
    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    selectedSlotIndex = slots.length - 1;

    const selectedSlotText = await slots[selectedSlotIndex].getText();

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      slots[selectedSlotIndex]
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
      "Boton Finish - Debe existir el botón 'Finish' para finalizar la agenda de la cita"
    );
    await global.driver.sleep(3000);

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta para agendar la segunda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[contains(text(),'E Drenaje Linfatico')]",
      "Opción terapia E Drenaje Linfatico - Debe existir una opción de terapia llamada 'E Drenaje Linfatico' en la página de agenda cita para la segunda cita"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo C']",
      "Opción Cubiculo C - Debe existir el área 'Cubiculo C' en las opciones de áreas del step Select Service Territory para la segunda cita"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    const therapistAndrea = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[contains(text(),'Andrea')]]//input[@type='radio']",
      "Terapeuta Andrea - Debe existir una fila con el nombre 'Andrea Ramirez' en la tabla de terapeutas y un radio button para seleccionarla"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistAndrea
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today - Debe existir el botón 'Today' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    let columnsDup = [];
    const startDup = Date.now();

    while (columnsDup.length < 2 && Date.now() - startDup < 25000) {
      columnsDup = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columnsDup.length < 2) await global.driver.sleep(300);
    }

    assert.ok(columnsDup.length >= 2, "No se encontraron columnas duplicadas");

    const targetColumnDup = columnsDup[1];
    const slotsDup = await targetColumnDup.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    const slotDuplicado = await global.helper.findOrFail(
      `//span[contains(@class,'slds-radio_faux')][normalize-space()='${selectedSlotText}']`,
      "Slot duplicado - Debe existir un slot con el mismo horario que la primera cita para validar la marca de cita empalmada"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      slotDuplicado
    );

    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Finish']",
      "Boton Finish - Debe existir el botón 'Finish' para finalizar la agenda de la cita"
    );
    await global.driver.sleep(3000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir una pestaña llamada 'Citas' en la página de cuenta para verificar las citas agendadas"
    );
    await global.driver.sleep(2500);

    const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
    assert.ok(rows.length > 1, "No hay citas suficientes para validar");

    const firstRow = rows[0];
    const citaLink = await firstRow.findElement(
      By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      citaLink
    );
    await global.driver.sleep(3000);

    const citaEmpalmadaChecked = await global.helper.findOrFail(
      "//span[normalize-space()='Cita empalmada']/ancestor::div[contains(@class,'slds-form-element')]//lightning-input//input[@type='checkbox' and @checked]",
      "Checkbox Cita empalmada marcado - No se muestra la advertencia de cita empalmada"
    );

    const warningIcon = await global.helper.findOrFail(
      "//span[normalize-space()='Cita empalmada']/ancestor::div[contains(@class,'slds-form-element')]//lightning-icon[contains(@class,'slds-icon-utility-warning')]",
      "Icono warning Cita empalmada - Debe existir un icono de advertencia al lado del checkbox de cita empalmada"
    );

    assert.ok(citaEmpalmadaChecked, "Cita empalmada NO está marcada");
    assert.ok(warningIcon, "No se mostró el icono de advertencia");
  });

  after(async () => {
    await global.helper.goToAccount(patientName);
    await global.driver.sleep(2000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir una pestaña llamada 'Citas' en la página de cuenta para eliminar las citas agendadas"
    );
    await global.driver.sleep(3000);

    for (let i = 0; i < 2; i++) {
      const rows = await global.driver.findElements(By.xpath("//tbody/tr"));
      if (!rows.length) break;

      const citaLink = await rows[0].findElement(
        By.xpath(".//th//a[contains(@href,'/lightning/r/')]")
      );

      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
        citaLink
      );
      await global.driver.sleep(3000);

      await global.helper.safeFindAndClick(
        "(//button[@name='Delete'])[2]",
        "Botón Delete - Debe existir un botón 'Delete' para eliminar la cita en la página de detalles de la cita"
      );

      await global.helper.safeFindAndClick(
        "//button[contains(@class,'forceActionButton')]//span[normalize-space()='Delete']/ancestor::button",
        "Confirmar Delete - Debe existir un botón 'Delete' para confirmar la eliminación de la cita en la ventana de confirmación"
      );

      await global.driver.sleep(2500);

      if (i < 1) {
        await global.helper.safeFindAndClick(
          "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
          "Pestaña Citas - Debe existir una pestaña llamada 'Citas' en la página de cuenta para verificar si quedan citas por eliminar"
        );
        await global.driver.sleep(2500);
      }
    }
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
