const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC10 — Permitir terapia duplicada", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Therapy: "H Fisica",
    Area: "Piso 1"
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC10 — Permitir terapia duplicada | 10 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe permitir agregar la misma terapia dos veces", async () => {
    const countSelectedTherapies = async () => {
      const items = await global.driver.findElements(
        By.xpath("//lightning-pill")
      );
      return items.length;
    };

    await global.helper.selectArea(expected.Area);

    const addTherapy = async (therapy) => {
      await global.helper.safeFindAndClick(
        "//button[@name='therapy']",
        "Botón Terapia - Debe existir un botón para seleccionar la terapia en el formulario de creación de citas de hospitalización"
      );
      await global.driver.sleep(200);

      await global.helper.safeFindAndClick(
        `//lightning-base-combobox-item//span[@title='${therapy}']`,
        `Opción Terapia ${therapy} - Debe existir una opción que contenga '${therapy}' en el campo de Terapia para seleccionar`
      );
      await global.driver.sleep(200);

      const addBtn = await global.helper.findOrFail(
        "//button[normalize-space()='Agregar']",
        "Botón Agregar - Debe existir un botón 'Agregar' para añadir terapias en el formulario de creación de citas de hospitalización"
      );

      await addBtn.click();
      await global.driver.sleep(300);
    };

    await addTherapy(expected.Therapy);
    const countAfterFirst = await countSelectedTherapies();

    await addTherapy(expected.Therapy);
    const countAfterSecond = await countSelectedTherapies();

    assert.strictEqual(countAfterSecond, countAfterFirst + 1);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
