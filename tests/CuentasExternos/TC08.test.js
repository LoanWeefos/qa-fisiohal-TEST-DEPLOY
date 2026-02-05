const assert = require("assert");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const { By } = require("selenium-webdriver");
const logger = require("../../helpers/logger");

describe("TC08 — Guardar account (mínimos obligatorios)", function () {
  this.timeout(0);

  const data = {
    birthDate: "02/11/2003",
    firstName: "Test",
    lastName: "TC08",
    phone: String(Math.floor(1000000000 + Math.random() * 9000000000)),
    email: "test.duran@qa.com",
    nationality: "Mexicana",
    gender: "Masculino",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC08 — Guardar account (mínimos obligatorios) | 8 de 11\n");
    }

    await global.helper.goToAccounts();

    await global.helper.safeFindAndClick(
      "//a[@role='button' and @title='New']",
      "Botón New Account"
    );

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cuenta Externa']/ancestor::label",
      "Opción Cuenta Externa"
    );

    await global.helper.safeFindAndClick(
      "//button[.//span[normalize-space()='Next']]",
      "Botón Next"
    );
  });

  it("Debe guardar y mostrar mensaje de éxito", async () => {
    const birth = await global.helper.findOrFail(
      "//input[@name='Fecha_de_Nacimiento__c']",
      "Fecha de nacimiento"
    );
    await birth.clear();
    await birth.sendKeys(data.birthDate);

    const first = await global.helper.findOrFail(
      "//input[@name='firstName']",
      "First Name"
    );
    await first.clear();
    await first.sendKeys(data.firstName);

    const last = await global.helper.findOrFail(
      "//input[@name='lastName']",
      "Last Name"
    );
    await last.clear();
    await last.sendKeys(data.lastName);

    const phone = await global.helper.findOrFail(
      "//input[@name='Phone']",
      "Phone"
    );
    await phone.clear();
    await phone.sendKeys(data.phone);

    const email = await global.helper.findOrFail(
      "//input[@name='PersonEmail']",
      "Correo"
    );
    await email.clear();
    await email.sendKeys(data.email);

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Nacionalidad']",
      "Combobox Nacionalidad"
    );

    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item//span[normalize-space()='Mexicana']",
      "Opción Mexicana"
    );

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Sexo']",
      "Combobox Sexo"
    );

    await global.helper.safeFindAndClick(
      `//lightning-base-combobox-item//span[normalize-space()='${data.gender}']`,
      "Opción Sexo"
    );

    await global.helper.saveForm();

    const toast = await global.helper.checkSuccessToast();

    assert.ok(toast.includes("was created"), `Toast inesperado: ${toast}`);

    assert.ok(
      toast.includes(`${data.firstName} ${data.lastName}`),
      `Nombre no presente en toast: ${toast}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
