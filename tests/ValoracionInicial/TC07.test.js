const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC07 — Validar campo Email inválido", function () {
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
      logger.info("\nEjecutando TC07 — Validar campo Email inválido | 7 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Se muestra un mensaje de validación indicando que el formato no es válido", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const correoInput = await global.helper.findOrFail(
      "//label[normalize-space()='Correo']/following::input[1]",
      "Campo Correo - No se encuentra en el formulario"
    );

    await correoInput.click();
    await correoInput.sendKeys(Key.CONTROL, "a");
    await correoInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(300);

    const emailInvalido = "uie@";
    await correoInput.sendKeys(emailInvalido);
    await global.driver.sleep(500);
    await correoInput.sendKeys(Key.TAB);
    await global.driver.sleep(500);

    const emailError = await global.driver.findElements(
      By.xpath(
        "//div[contains(@class,'slds-form-element__help') and " +
        "contains(normalize-space(),'Enter a valid email address')]"
      )
    );


    assert.ok(
      emailError.length > 0,
      "No se mostró el mensaje de error por formato inválido en el campo Correo"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
