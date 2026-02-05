const assert = require("assert");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const { By, until } = require("selenium-webdriver");
const logger = require("../../helpers/logger");

describe("TC09 — Guardar account con advertencia de duplicados", function () {
  this.timeout(0);

  const data = {
    birthDate: "02/11/2003",
    firstName: "Test",
    lastName: "TC09",
    phone: "6441234567",
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
      logger.info("\nEjecutando TC09 — Guardar account con advertencia de duplicados | 9 de 11\n");
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

  it("Debe mostrar advertencia de duplicado y permitir guardar", async () => {
    await (
      await global.helper.findOrFail(
        "//input[@name='Fecha_de_Nacimiento__c']",
        "Fecha de Nacimiento"
      )
    ).sendKeys(data.birthDate);

    await (
      await global.helper.findOrFail("//input[@name='firstName']", "Nombre")
    ).sendKeys(data.firstName);

    await (
      await global.helper.findOrFail("//input[@name='lastName']", "Apellido")
    ).sendKeys(data.lastName);

    await (
      await global.helper.findOrFail("//input[@name='Phone']", "Teléfono")
    ).sendKeys(data.phone);

    await (
      await global.helper.findOrFail("//input[@name='PersonEmail']", "Email")
    ).sendKeys(data.email);

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Nacionalidad']",
      "Botón Nacionalidad"
    );
    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item//span[normalize-space()='Mexicana']",
      "Opción Mexicana"
    );

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Sexo']",
      "Botón Sexo"
    );
    await global.helper.safeFindAndClick(
      `//lightning-base-combobox-item//span[normalize-space()='${data.gender}']`,
      "Opción Masculino"
    );

    await global.helper.saveForm();

    const duplicateHeader = await global.helper.findOrFail(
      "//records-record-edit-error-header//h2[normalize-space()='Similar Records Exist']",
      "Mensaje de duplicados - No se encontro cuenta duplicada / No hay validación de duplicados"
    );

    assert.ok(duplicateHeader, "No apareció el mensaje de duplicados");

    await global.helper.saveForm();

    const toast = await global.helper.checkSuccessToast();

    assert.ok(toast.includes("duplicates exist"), `Mensaje inesperado: ${toast}`);

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
