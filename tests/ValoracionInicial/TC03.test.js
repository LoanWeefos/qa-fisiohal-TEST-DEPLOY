const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC03 — Validar que campo Edad", function () {
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
      logger.info("\nEjecutando TC03 — Validar que campo Edad | 3 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("La edad se calcula automáticamente y se muestra en el campo Edad", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const edadInput = await global.helper.findOrFail(
      "//span[normalize-space()='Edad']/ancestor::div[contains(@class,'flowruntime-input')]//input",
      "Campo Edad - El sistema no muestra el campo Edad o no es un campo de entrada"
    );

    const edadUI = (await edadInput.getAttribute("value")).trim();

    assert.ok(
      edadUI.length > 0,
      "El campo Edad está vacío y debería calcularse automáticamente"
    );

    const calcularEdad = (fechaNacimiento) => {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad.toString();
    };

    const edadEsperada = calcularEdad("2000-01-01");

    const match = edadUI.match(/^(\d+)\s*años/i);

    assert.ok(
      match,
      `Formato inesperado en campo Edad: "${edadUI}"`
    );

    const edadAniosUI = match[1];

    assert.strictEqual(
      edadAniosUI,
      edadEsperada,
      `Edad incorrecta. Esperado: ${edadEsperada}, Encontrado: ${edadAniosUI}`
    );

    const isReadOnly = await edadInput.getAttribute("readonly");
    const isDisabled = await edadInput.getAttribute("disabled");
    const isAriaDisabled = await edadInput.getAttribute("aria-disabled");

    assert.ok(
      isReadOnly !== null ||
      isDisabled !== null ||
      isAriaDisabled === "true",
      "El campo Edad no debe ser editable"
    );

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
