const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC17 — Cambio de área elimina terapias no compatibles", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    AreaInitial: "Piso 1",
    TherapyInitial: "H Ortopedia",
    AreaFinal: "Piso 2",
    TherapyFinal: "H Pulmonar",
  };

  const countTherapies = async () => {
    await global.helper.findOrFail(
      "//div[contains(@class,'pill-list')]",
      "Contenedor de terapias seleccionadas - Debe existir un contenedor que muestre las terapias seleccionadas en el formulario de creación de citas de hospitalización"
    );

    const pills = await global.driver.findElements(
      By.xpath(
        "//div[contains(@class,'pill-list')]//span[contains(@class,'slds-pill__label')]"
      )
    );
    return pills.length;
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC17 — Cambio de área elimina terapias no compatibles | 17 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe eliminar la terapia previa al cambiar el área", async () => {
    await global.helper.selectArea(expected.AreaInitial);
    await global.helper.selectTherapyAndAdd(expected.TherapyInitial);

    const countAfterFirst = await countTherapies();
    assert.strictEqual(countAfterFirst, 1, "No se agregó la primera terapia.");

    await global.helper.selectArea(expected.AreaFinal);

    const countAfterAreaChange = await countTherapies();
    assert.strictEqual(
      countAfterAreaChange,
      0,
      "La terapia anterior NO se eliminó al cambiar de área."
    );

    await global.helper.selectTherapyAndAdd(expected.TherapyFinal);

    const countFinal = await countTherapies();
    assert.strictEqual(
      countFinal,
      1,
      "Debe existir solo una terapia después del cambio de área."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
