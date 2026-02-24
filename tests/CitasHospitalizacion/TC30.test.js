const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC30 — Asignar terapia donde ya hay otra con el mismo paciente", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Day: "29",
    MonthLabel: "December",
    Year: "2026",
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
      logger.info("\nEjecutando TC30 — Asignar terapia donde ya hay otra con el mismo paciente | 30 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
  });

  it("Debe bloquear creación de cita fuera de horario por conflicto con el mismo paciente", async () => {
    await global.helper.openCreateForm();
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    let saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    assert.strictEqual(
      await global.helper.isButtonDisabled(saveBtn),
      false,
      "Guardar está deshabilitado para la primera cita."
    );

    await saveBtn.click();

    assert.ok(
      await global.helper.checkSuccessToast(),
      "No se creó correctamente la primera cita."
    );

    await global.driver.navigate().refresh();
    await global.driver.sleep(1500);

    await global.helper.openCreateForm();
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);
    let errorToast = false;

    if (!isDisabled) {
      await saveBtn.click();
      await global.driver.sleep(800);
      errorToast = !!(await global.helper.checkErrorToast());
    }

    assert.ok(
      isDisabled || errorToast,
      "El sistema permitió crear una cita duplicada para el mismo paciente."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
