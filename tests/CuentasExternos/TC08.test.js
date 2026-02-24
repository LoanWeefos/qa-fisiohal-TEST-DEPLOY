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
      "Botón New Account - Debe hacer clic en el botón New para abrir el formulario de creación de cuenta"
    );

    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cuenta Externa']/ancestor::label",
      "Opción Cuenta Externa - Debe seleccionar la opción 'Cuenta Externa' al crear una nueva cuenta"
    );

    await global.helper.safeFindAndClick(
      "//button[.//span[normalize-space()='Next']]",
      "Botón Next - Debe hacer clic en el botón Next para avanzar al formulario de creación de cuenta"
    );
  });

  it("Debe guardar y mostrar mensaje de éxito", async () => {
    const birth = await global.helper.findOrFail(
      "//input[@name='Fecha_de_Nacimiento__c']",
      "Fecha de nacimiento - Debe encontrar el campo de fecha de nacimiento para ingresar una fecha válida"
    );
    await birth.clear();
    await birth.sendKeys(data.birthDate);

    const first = await global.helper.findOrFail(
      "//input[@name='firstName']",
      "First Name - Debe encontrar el campo de First Name para ingresar un nombre"
    );
    await first.clear();
    await first.sendKeys(data.firstName);

    const last = await global.helper.findOrFail(
      "//input[@name='lastName']",
      "Last Name - Debe encontrar el campo de Last Name para ingresar un apellido"
    );
    await last.clear();
    await last.sendKeys(data.lastName);

    const phone = await global.helper.findOrFail(
      "//input[@name='Phone']",
      "Phone - Debe encontrar el campo de Phone para ingresar un número de teléfono"
    );
    await phone.clear();
    await phone.sendKeys(data.phone);

    const email = await global.helper.findOrFail(
      "//input[@name='PersonEmail']",
      "Correo electrónico - Debe encontrar el campo de correo electrónico para ingresar una dirección de email válida"
    );
    await email.clear();
    await email.sendKeys(data.email);

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Nacionalidad']",
      "Combobox Nacionalidad - Debe hacer clic en el combobox de Nacionalidad para seleccionar una nacionalidad"
    );

    await global.helper.safeFindAndClick(
      "//lightning-base-combobox-item//span[normalize-space()='Mexicana']",
      "Opción Mexicana - Debe seleccionar la opción 'Mexicana' en el combobox de Nacionalidad"
    );

    await global.helper.safeFindAndClick(
      "//button[@role='combobox' and @aria-label='Sexo']",
      "Combobox Sexo - Debe hacer clic en el combobox de Sexo para seleccionar un género"
    );

    await global.helper.safeFindAndClick(
      `//lightning-base-combobox-item//span[normalize-space()='${data.gender}']`,
      "Opción Sexo - Debe seleccionar la opción correspondiente al género en el combobox de Sexo"
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
