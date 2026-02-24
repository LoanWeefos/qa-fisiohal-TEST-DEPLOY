const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC21 — Validar fecha pasada desde calendario", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    PastYear: "2025",
    PastMonthLabel: "December",
    PastMonthNumber: "12",
    PastDay: "1",
    Area: "Piso 1",
    Therapy: "H Fisica",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC21 — Validar fecha pasada desde calendario | 21 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe bloquear el guardado cuando se selecciona una fecha pasada", async () => {
    await global.helper.selectFrequency(expected.Frequency);

    await global.helper.safeFindAndClick(
      "//label[normalize-space()='Fecha']/following::input[1]",
      "Campo Fecha - Debe existir un campo para seleccionar la fecha en el formulario de creación de citas de hospitalización"
    );
    await global.driver.sleep(400);

    const yearSelect = await global.helper.findOrFail(
      "//select[contains(@class,'slds-select')]",
      "Selector de año - Debe existir un selector de año en el formulario de creación de citas de hospitalización"
    );
    await yearSelect.click();

    await global.helper.safeFindAndClick(
      `//option[@value='${expected.PastYear}']`,
      `Año ${expected.PastYear} - Debe existir una opción para el año ${expected.PastYear} en el selector de año del formulario de creación de citas de hospitalización`
    );
    await global.driver.sleep(300);

    let visibleMonth = await global.helper
      .findOrFail("//lightning-calendar//h2", "Encabezado del calendario")
      .then((el) => el.getText());

    let tries = 0;
    while (!visibleMonth.includes(expected.PastMonthLabel) && tries < 12) {
      await global.helper.safeFindAndClick(
        "//button[@title='Previous Month']",
        "Botón Mes Anterior - Debe existir un botón para retroceder al mes anterior en el calendario de selección de fecha"
      );
      await global.driver.sleep(300);
      visibleMonth = await global.helper
        .findOrFail("//lightning-calendar//h2", "Encabezado del calendario - Debe existir un encabezado del calendario en el formulario de creación de citas de hospitalización")
        .then((el) => el.getText());
      tries++;
    }

    const pastDayXpath = `//td[@data-value='${expected.PastYear}-${
      expected.PastMonthNumber
    }-${String(expected.PastDay).padStart(2, "0")}']`;

    const dayCell = await global.helper.findOrFail(
      pastDayXpath,
      "Día pasado en calendario - Debe existir una celda para el día pasado seleccionado en el calendario de selección de fecha del formulario de creación de citas de hospitalización"
    );

    await dayCell.click();
    await global.driver.sleep(300);

    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);

    let errorToast = false;
    if (!isDisabled) {
      await saveBtn.click();
      errorToast = await global.helper.checkErrorToast();
    }

    assert.ok(
      isDisabled || errorToast,
      "El sistema permitió guardar con fecha pasada."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
