const assert = require("assert");
const { By, Key } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC20 — Guardar sin fecha (validar comportamiento)", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 1",
    Therapy: "H Fisica",
  };

  const tryClearDate = async () => {
    const dateInputXpath =
      "//label[normalize-space()='Fecha']/following::input[1]";

    await global.helper.safeFindAndClick(dateInputXpath, "Campo Fecha");
    await global.driver.sleep(200);

    const elementDate = await global.helper.findOrFail(
      dateInputXpath,
      "Campo Fecha"
    );

    const before = await elementDate.getAttribute("value");

    await elementDate.sendKeys(Key.CONTROL, "a");
    await global.driver.sleep(50);
    await elementDate.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(300);

    const after = await elementDate.getAttribute("value");

    return {
      before,
      after,
      cleared: Boolean(before && !after),
    };
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC20 — Guardar sin fecha | 20 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe validar el comportamiento del sistema cuando se intenta quitar la fecha", async () => {
    await global.helper.selectFrequency(expected.Frequency);

    const dateResult = await tryClearDate();

    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar"
    );

    if (!dateResult.cleared) {
      assert.ok(
        dateResult.after,
        "La fecha debería seguir presente al ser obligatoria."
      );
      return;
    }

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);

    assert.strictEqual(
      isDisabled,
      true,
      "Guardar debería estar deshabilitado si la fecha está vacía."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
