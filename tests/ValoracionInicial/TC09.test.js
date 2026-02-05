const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC09 — Validar campo nacionalidad", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC09 — Validar campo nacionalidad | 9 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo muestra el valor de la nacionalidad del paciente sin opcion de edición", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const nacionalidadValue = await global.helper.findOrFail(
      "//button[@aria-label='Nacionalidad']//span[contains(@class,'slds-truncate')]",
      "Valor Nacionalidad - No se encuentra en el formulario"
    );
    const before = (await nacionalidadValue.getText()).trim();

    const nacionalidadBtn = await global.helper.findOrFail(
      "//button[@aria-label='Nacionalidad']",
      "Campo Nacionalidad"
    );
    await nacionalidadBtn.click();
    await global.driver.sleep(600);

    const optXpath =
      "//span[@title='Estadounidense' or normalize-space()='Estadounidense']";

    const opts = await global.driver.findElements(By.xpath(optXpath));

    if (opts.length > 0) {
      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
        opts[0]
      );
      await global.driver.sleep(600);
    }

    const nacionalidadValueDup = await global.helper.findOrFail(
      "//button[@aria-label='Nacionalidad']//span[contains(@class,'slds-truncate')]",
      "Valor Nacionalidad (después)"
    );
    const after = (await nacionalidadValueDup.getText()).trim();

    assert.strictEqual(
      after,
      before,
      `ERROR: El campo Nacionalidad permitió edición. Antes: "${before}" | Después: "${after}"`
    );

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
