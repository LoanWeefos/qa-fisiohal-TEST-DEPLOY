const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC10 — Validar datos completos en Cuenta Externa", function () {
  this.timeout(0);

  const expected = {
    accountName: "Test Durán",
    birthDate: "02/11/2003",
    phone: "6441234567",
    nationality: "Mexicana",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC10 — Validar datos completos en Cuenta Externa | 10 de 11\n");
    }

    await global.helper.goToAccount(expected.accountName);
  });

  it("Debe mostrar los datos correctos del registro", async () => {
    const nameElement = await global.helper.findOrFail(
      "//div[@data-target-selection-name='sfdc:RecordField.Account.Name']//span[contains(@class,'test-id__field-value')]",
      "AccountName - Debe mostrar el nombre de la cuenta externa correctamente en la vista de registro"
    );
    assert.strictEqual(
      (await nameElement.getText()).trim(),
      expected.accountName
    );

    const phoneElement = await global.helper.findOrFail(
      "//div[@data-target-selection-name='sfdc:RecordField.Account.Phone']//span[contains(@class,'test-id__field-value')]",
      "Phone - Debe mostrar el número de teléfono correctamente en la vista de registro"
    );
    const phoneText = (await phoneElement.getText()).replace(/\D/g, "");
    assert.strictEqual(phoneText, expected.phone);

    const birthElement = await global.helper.findOrFail(
      "//div[@data-target-selection-name='sfdc:RecordField.Account.Fecha_de_Nacimiento__c']//span[contains(@class,'test-id__field-value')]",
      "Fecha de Nacimiento - Debe mostrar la fecha de nacimiento correctamente en la vista de registro"
    );
    assert.strictEqual(
      (await birthElement.getText()).trim(),
      expected.birthDate
    );

    const nationalityElement = await global.helper.findOrFail(
      "//div[@data-target-selection-name='sfdc:RecordField.Account.Nacionalidad__c']//span[contains(@class,'test-id__field-value')]",
      "Nacionalidad - Debe mostrar la nacionalidad correctamente en la vista de registro"
    );
    assert.strictEqual(
      (await nationalityElement.getText()).trim(),
      expected.nationality
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
