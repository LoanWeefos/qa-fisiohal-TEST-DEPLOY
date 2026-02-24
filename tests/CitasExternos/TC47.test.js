const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC47 — Validar registro de cita recurrente Martes y Jueves", function () {
  this.timeout(0);

  const patientName = "TEST TEST";

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC47 — Validar registro de cita recurrente Martes y Jueves | 47 de 50\n"
      );
    }

    await global.helper.goToAccount(patientName);
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe registrar una cita recurrente solo Martes y Jueves y reflejarse en calendario", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Terapia - Debe existir una opción de terapia llamada 'E Drenaje Linfatico' en la página de agenda cita"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Cubiculo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
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
    await global.driver.executeScript("arguments[0].click();", therapistRadio);
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

    const targetColumn = columns[1];
    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    await global.driver.executeScript("arguments[0].click();", slots.at(-1));
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(2000);

    const toggle = await global.helper.findOrFail(
      "//span[normalize-space()='¿Deseas activar recurrencia?']/ancestor::label//input[@type='checkbox']",
      "Toggle Recurrencia - Debe existir un toggle para activar recurrencia en la página de agenda cita"
    );
    await global.driver.executeScript("arguments[0].click();", toggle);
    await global.driver.sleep(600);

    const cantidadInput = await global.helper.findOrFail(
      "//input[@name='Cantidad_de_Citas']",
      "Input Cantidad - Debe existir un input llamado 'Cantidad_de_Citas' en la página de agenda cita"
    );
    await cantidadInput.clear();
    await cantidadInput.sendKeys("4");
    await global.driver.sleep(400);

    const martesCheckbox = await global.helper.findOrFail(
      "//input[@name='D_as_por_agendar' and @value='Martes']",
      "Martes - Debe existir un checkbox para seleccionar el día Martes al activar la recurrencia de la cita"
    );
    const juevesCheckbox = await global.helper.findOrFail(
      "//input[@name='D_as_por_agendar' and @value='Jueves']",
      "Jueves - Debe existir un checkbox para seleccionar el día Jueves al activar la recurrencia de la cita"
    );

    await global.driver.executeScript("arguments[0].click();", martesCheckbox);
    await global.driver.executeScript("arguments[0].click();", juevesCheckbox);
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
      "//button[normalize-space()='Finish']",
      "Boton Finish - Debe existir el botón 'Finish' para finalizar el flujo de agenda cita"
    );
    await global.driver.sleep(4000);

    await global.helper.safeFindAndClick(
      "//button[contains(@title,'App Launcher')]",
      "App Launcher - Debe existir el botón de App Launcher para buscar el calendario"
    );
    await global.driver.sleep(600);

    const searchInput = await global.helper.findOrFail(
      "//input[@type='search' and contains(@placeholder,'Search apps and items')]",
      "Search Input - Debe existir un input de búsqueda en la aplicación",
      60000
    );

    await searchInput.clear();
    await searchInput.sendKeys("Calendario FisioHal");
    await global.driver.sleep(700);

    await global.helper.safeFindAndClick(
      "//a[contains(@class,'al-menu-item') and contains(@data-label,'Calendario FisioHal')]",
      "Calendario FisioHal - Debe existir una opción llamada 'Calendario FisioHal' en el App Launcher"
    );
    await global.driver.sleep(3000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(4000);

    let martesCount = 0;
    let juevesCount = 0;

    const nextCalendarBtn = await global.helper.findOrFail(
      "//button[contains(@class,'fc-next-button')]",
      "Next calendar button - Debe existir un botón para avanzar al siguiente rango de fechas en el calendario"
    );

    for (let i = 0; i < 4 && (martesCount < 2 || juevesCount < 2); i++) {
      const martesEvents = await global.driver.findElements(
        By.xpath(
          `//div[contains(@class,'fc-content-skeleton')]//tr[1]/td[4]//div[contains(@class,'fc-event-container')]//small[contains(.,'${patientName}')]`
        )
      );

      const juevesEvents = await global.driver.findElements(
        By.xpath(
          `//div[contains(@class,'fc-content-skeleton')]//tr[1]/td[6]//div[contains(@class,'fc-event-container')]//small[contains(.,'${patientName}')]`
        )
      );

      if (martesEvents.length > 0) martesCount++;
      if (juevesEvents.length > 0) juevesCount++;

      if (martesCount >= 2 && juevesCount >= 2) break;

      await nextCalendarBtn.click();
      await global.driver.sleep(1500);
    }

    await global.helper.goToAccount(patientName);
    await global.driver.sleep(2000);

    await global.driver.navigate().refresh();
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
      "Pestaña Citas - Debe existir una pestaña llamada 'Citas' en la página de cuenta"
    );
    await global.driver.sleep(3000);

    let citasRestantes = true;
    let safety = 0;

    while (citasRestantes && safety < 6) {
      safety++;

      const rows = await global.driver.findElements(By.xpath("//tbody/tr"));

      if (!rows.length) {
        citasRestantes = false;
        break;
      }

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

      await global.helper.safeFindAndClick(
        "//a[@role='tab' and (@data-label='Citas' or normalize-space()='Citas')]",
        "Pestaña Citas - Debe existir una pestaña llamada 'Citas' en la página de cuenta para verificar si quedan citas por eliminar"
      );
      await global.driver.sleep(2500);
    }

    assert.ok(martesCount >= 1, `Se encontraron ${martesCount} martes`);
    assert.ok(juevesCount >= 1, `Se encontraron ${juevesCount} jueves`);
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
