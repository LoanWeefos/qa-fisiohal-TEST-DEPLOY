const assert = require("assert");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC13 — Al crear muchas citas debe fallar por disponibilidad", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 2",
    Therapy: "H Fisica",
    Day: "23",
    MonthLabel: "December",
    Year: "2026",
    MaxAttempts: 5,
  };

  const createOneAppointment = async () => {
    await global.helper.openCreateForm();

    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar"
    );

    assert.strictEqual(await global.helper.isButtonDisabled(saveBtn), false);

    await saveBtn.click();
    await global.driver.sleep(800);

    return !!(await global.helper.checkSuccessToast());
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC13 — Al crear muchas citas debe fallar por disponibilidad | 13 de 36\n"
      );
    }
  });

  it("Al crear muchas citas en la misma fecha/terapia/área, debe fallar por disponibilidad de horario", async () => {
    let successCount = 0;
    let failedByLimit = false;
    await global.helper.goToAccount(expected.AccountName);

    for (let i = 1; i <= expected.MaxAttempts; i++) {
      const ok = await createOneAppointment();

      if (ok) {
        successCount++;
      } else {
        failedByLimit = true;
        break;
      }

      await global.driver.sleep(1200);
    }

    assert.strictEqual(
      failedByLimit,
      true,
      "No se presentó fallo por límite de disponibilidad."
    );
    assert.strictEqual(successCount > 0, true);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
