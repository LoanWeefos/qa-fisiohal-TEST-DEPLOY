const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC24 — Validar eliminar terapia y bloqueo de Guardar", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Area: "Piso 1",
    Therapy: "H Fisica",
  };

  const countTherapies = async () => {
    return (
      await global.driver.findElements(
        By.xpath("//span[contains(@class,'slds-pill__label')]")
      )
    ).length;
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC24 — Validar eliminar terapia y bloqueo de Guardar | 24 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();

    await global.helper.selectArea(expected.Area);
    await global.helper.selectTherapyAndAdd(expected.Therapy);
  });

  it("Debe deshabilitar Guardar al eliminar la terapia", async () => {
    const pillsBefore = await countTherapies();
    assert.strictEqual(pillsBefore, 1, "No se agregó la terapia inicial.");

    const removeBtn =
      "//button[contains(@title,'Remove') or contains(@aria-label,'Eliminar')]";

    await global.helper.safeFindAndClick(removeBtn, "Botón Eliminar Terapia - Debe existir un botón para eliminar la terapia seleccionada en el formulario de creación de citas de hospitalización");
    await global.driver.sleep(300);

    const pillsAfter = await countTherapies();
    assert.ok(pillsAfter < pillsBefore, "La terapia no se eliminó.");

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);

    assert.strictEqual(
      isDisabled,
      true,
      "Guardar debería estar deshabilitado sin terapias."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
