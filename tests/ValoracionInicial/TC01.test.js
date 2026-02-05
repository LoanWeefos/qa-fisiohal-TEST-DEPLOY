const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC01 — Validar nombre completo", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC01 — Validar nombre completo | 1 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo paciente deberá mostrar el nombre completo del paciente", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const pacienteName = await global.helper.findOrFail(
      "//p[normalize-space()='Paciente:']/following-sibling::p[1]",
      "Nombre del paciente"
    );

    const pacienteUI = (await pacienteName.getText()).trim();
    assert.strictEqual(
      pacienteUI,
      expected.AccountName,
      `Nombre del paciente incorrecto. Esperado: ${expected.AccountName}, Encontrado: ${pacienteUI}`
    );

    const editableFields = await global.driver.findElements(
      By.xpath(
        "//p[normalize-space()='Paciente:']/ancestor::flowruntime-lwc-field//input | " +
        "//p[normalize-space()='Paciente:']/ancestor::flowruntime-lwc-field//textarea"
      )
    );

    assert.strictEqual(
      editableFields.length,
      0,
      "El campo Paciente no debe ser editable"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
